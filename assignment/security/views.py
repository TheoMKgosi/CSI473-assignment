import logging
import random
import string
import time
import uuid
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.utils import timezone
from rest_framework.authtoken.models import Token
from .models import SecurityProfile, ScanLog
from adminstrator.models import SecurityCompliance
from members.models import PanicAlert

# Setup logger
logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def security_signup(request):
    logger.info("Security signup attempt received.")
    try:
        data = request.data
        logger.debug(f"Signup data: {data}")

        # Required fields
        required_fields = ['first_name', 'last_name', 'email', 'password']
        for field in required_fields:
            if field not in data or not data[field]:
                logger.warning(f"Missing required field: {field}")
                return Response({'error': f'{field} is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Check existing user
        if User.objects.filter(email=data['email']).exists():
            logger.warning(f"Duplicate email signup attempt: {data['email']}")
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        # Generate unique employee ID
        def generate_employee_id():

            max_attempts = 10  # Prevent infinite loop
            for _ in range(max_attempts):
                # Generate a more unique ID with timestamp component
                timestamp_part = str(int(time.time()))[-4:]  # Last 4 digits of timestamp
                random_part = ''.join(random.choices(string.digits, k=4))
                eid = f'SEC{timestamp_part}{random_part}'
                if not SecurityProfile.objects.filter(employee_id=eid).exists():
                    return eid
            return f'SEC{uuid.uuid4().hex[:8].upper()}'

        employee_id = generate_employee_id()
        logger.debug(f"Generated employee ID: {employee_id}")

        # Create user
        user = User.objects.create_user(
            username=data['email'],
            email=data['email'],
            password=data['password'],
            first_name=data['first_name'],
            last_name=data['last_name']
        )
        logger.info(f"User created: {user.email}")

        # Create security profile
        SecurityProfile.objects.create(
            user=user,
            phone_number=data.get('phone_number', ''),
            address=data.get('address', ''),
            date_of_birth=data.get('date_of_birth'),
            employee_id=employee_id,
            status='pending'
        )
        logger.info(f"Security profile created for {user.email}")

        return Response({
            'success': True,
            'message': 'Account created successfully. Awaiting approval.',
            'employee_id': employee_id,
            'user_id': user.id
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.exception("Error during security signup")
        return Response({'error': f'Signup failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def security_login(request):
    logger.info("Security login attempt received.")
    try:
        data = request.data
        logger.debug(f"Login data: {data}")

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            logger.warning("Missing email or password")
            return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            logger.warning(f"Login failed: Unknown email {email}")
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)

        user = authenticate(username=user.username, password=password)
        if user is None:
            logger.warning(f"Authentication failed for email {email}")
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)

        # Check profile status
        try:
            profile = SecurityProfile.objects.get(user=user)
        except SecurityProfile.DoesNotExist:
            logger.error(f"Security profile missing for {email}")
            return Response({'error': 'Security profile not found'}, status=status.HTTP_404_NOT_FOUND)

        if profile.status != 'approved':
            logger.info(f"User {email} attempted login with status {profile.status}")
            return Response({'error': f'Account is {profile.status}. Please contact administrator.'}, status=status.HTTP_403_FORBIDDEN)

        token, _ = Token.objects.get_or_create(user=user)
        logger.debug(f"Token issued for {email}")

        return Response({
            'success': True,
            'message': 'Login successful',
            'token': token.key,
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'employee_id': profile.employee_id
            }
        })

    except Exception as e:
        logger.exception("Error during security login")
        return Response({'error': f'Login failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def security_profile(request):
    logger.info(f"Profile requested by {request.user.email}")
    try:
        profile = SecurityProfile.objects.get(user=request.user)
        logger.debug(f"Profile found for {request.user.email}")

        return Response({
            'user': {
                'id': request.user.id,
                'email': request.user.email,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
            },
            'profile': {
                'employee_id': profile.employee_id,
                'phone_number': profile.phone_number,
                'address': profile.address,
                'date_of_birth': profile.date_of_birth,
                'status': profile.status,
            }
        })
    except SecurityProfile.DoesNotExist:
        logger.error(f"Profile not found for {request.user.email}")
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)




def validate_qr_data(qr_data, security_profile):
    """Helper function to validate QR data for scanning"""
    from members.models import UserProfile
    from adminstrator.models import Route

    qr_data_clean = qr_data.strip()

    if qr_data_clean.startswith('member:'):
        try:
            parts = qr_data_clean.split(':')
            if len(parts) >= 2:
                member_id_str = parts[1].strip()
                member_id = int(member_id_str)
            else:
                raise ValueError("No member ID found after 'member:'")

            # Check if the member exists and is approved
            try:
                member = UserProfile.objects.get(id=member_id)
                if member.status != 'approved':
                    return {
                        'success': False,
                        'message': f'Member {member.full_name} is not approved'
                    }
            except UserProfile.DoesNotExist:
                return {
                    'success': False,
                    'message': f'Member not found for ID {member_id}'
                }

            # Check if the guard has an assigned route that includes this member
            assigned_route = Route.objects.filter(
                assigned_security_guard=security_profile,
                checkpoints__id=member_id
            ).first()

            if not assigned_route:
                return {
                    'success': False,
                    'message': f'Member {member.full_name} is not part of your assigned patrol route'
                }

            return {
                'success': True,
                'type': 'member_checkpoint',
                'member': {
                    'id': member.id,
                    'full_name': member.full_name,
                    'address': member.address,
                    'route_name': assigned_route.name,
                },
                'location': member.address,
                'message': f'Member checkpoint {member.full_name} validated successfully for route {assigned_route.name}'
            }
        except (ValueError, IndexError) as e:
            return {
                'success': False,
                'message': f'Invalid member QR code format: {str(e)}'
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error validating member QR code: {str(e)}'
            }

    # For now, only support member QR codes
    return {
        'success': False,
        'message': 'Unsupported QR code type'
    }


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def security_validate_qr(request):
    logger.info(f"QR validation requested by {request.user.email}")
    try:
        data = request.data
        qr_data = data.get('qr_data')

        if not qr_data:
            return Response({'error': 'qr_data is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if it's a member QR code (format: "member:{user_id}")
        qr_data_clean = qr_data.strip()  # Remove any whitespace
        if qr_data_clean.startswith('member:'):
            logger.info(f"Processing member QR code: '{qr_data}' (cleaned: '{qr_data_clean}')")
            try:
                # Split and get the member ID, handling potential extra colons
                parts = qr_data_clean.split(':')
                if len(parts) >= 2:
                    member_id_str = parts[1].strip()
                    member_id = int(member_id_str)
                else:
                    raise ValueError("No member ID found after 'member:'")

                logger.info(f"Extracted member_id: {member_id}")
                from members.models import UserProfile

                # First check if the user exists
                try:
                    member_profile = UserProfile.objects.get(user_id=member_id)
                    logger.info(f"Found member profile: {member_profile}, status: '{member_profile.status}'")
                except UserProfile.DoesNotExist:
                    logger.warning(f"UserProfile not found for user_id: {member_id}")
                    # Let's also check if there are any UserProfiles at all
                    total_profiles = UserProfile.objects.count()
                    logger.info(f"Total UserProfiles in database: {total_profiles}")
                    return Response({
                        'success': False,
                        'message': f'Member profile not found for ID {member_id}'
                    })

                # Check if approved - be more flexible with status checking
                if member_profile.status not in ['approved', 'Approved']:
                    logger.warning(f"Member {member_id} has status: '{member_profile.status}', not approved")
                    return Response({
                        'success': False,
                        'message': f'Member status is {member_profile.status}, not approved'
                    })

                logger.info(f"Successfully validated member: {member_profile.full_name}")
                return Response({
                    'success': True,
                    'type': 'member',
                    'member': {
                        'id': member_profile.user.id,
                        'full_name': member_profile.full_name,
                        'email': member_profile.user.email,
                        'phone': member_profile.phone,
                        'address': member_profile.address,
                    },
                    'message': f'Member {member_profile.full_name} verified successfully'
                })
            except (ValueError, IndexError) as e:
                logger.error(f"Error parsing member QR code '{qr_data}': {e}")
                return Response({
                    'success': False,
                    'message': f'Invalid member QR code format: {str(e)}'
                })
            except Exception as e:
                logger.error(f"Unexpected error validating member QR code: {e}")
                return Response({
                    'success': False,
                    'message': f'Error validating member QR code: {str(e)}'
                })

        # Check if it's a member checkpoint QR code for patrol routes
        if qr_data_clean.startswith('member:'):
            logger.info(f"Processing member checkpoint QR code: '{qr_data}' (cleaned: '{qr_data_clean}')")
            try:
                # Split and get the member ID
                parts = qr_data_clean.split(':')
                if len(parts) >= 2:
                    member_id_str = parts[1].strip()
                    member_id = int(member_id_str)
                else:
                    raise ValueError("No member ID found after 'member:'")

                logger.info(f"Extracted member_id: {member_id}")
                from members.models import UserProfile
                from adminstrator.models import Route

                # Check if the member exists and is approved
                try:
                    member = UserProfile.objects.get(id=member_id)
                    if member.status != 'approved':
                        logger.warning(f"Member {member_id} has status: '{member.status}', not approved")
                        return Response({
                            'success': False,
                            'message': f'Member {member.full_name} is not approved'
                        })
                    logger.info(f"Found approved member: {member.full_name} - {member.address}")
                except UserProfile.DoesNotExist:
                    logger.warning(f"Member not found for id: {member_id}")
                    return Response({
                        'success': False,
                        'message': f'Member not found for ID {member_id}'
                    })

                # Get the security guard's profile
                try:
                    security_profile = SecurityProfile.objects.get(user=request.user)
                except SecurityProfile.DoesNotExist:
                    logger.error(f"Security profile not found for {request.user.email}")
                    return Response({
                        'success': False,
                        'message': 'Security profile not found'
                    })

                # Check if the guard has an assigned route that includes this member
                assigned_route = Route.objects.filter(
                    assigned_security_guard=security_profile,
                    checkpoints__id=member_id
                ).first()

                if not assigned_route:
                    logger.warning(f"Member {member_id} is not in {request.user.email}'s assigned route")
                    return Response({
                        'success': False,
                        'message': f'Member {member.full_name} is not part of your assigned patrol route'
                    })

                logger.info(f"Successfully validated member checkpoint: {member.full_name} for guard {request.user.email}")
                return Response({
                    'success': True,
                    'type': 'member_checkpoint',
                    'member': {
                        'id': member.id,
                        'full_name': member.full_name,
                        'address': member.address,
                        'route_name': assigned_route.name,
                    },
                    'message': f'Member checkpoint {member.full_name} validated successfully for route {assigned_route.name}'
                })
            except (ValueError, IndexError) as e:
                logger.error(f"Error parsing member checkpoint QR code '{qr_data}': {e}")
                return Response({
                    'success': False,
                    'message': f'Invalid member checkpoint QR code format: {str(e)}'
                })
            except Exception as e:
                logger.error(f"Unexpected error validating member checkpoint QR code: {e}")
                return Response({
                    'success': False,
                    'message': f'Error validating member checkpoint QR code: {str(e)}'
                })

        # Check if it's a location QR code for patrol routes
        valid_locations = [
            'Building A - Lobby',
            'Building B - North Entrance',
            'Building C - Server Room',
            'Parking Garage - Level 2',
            'Main Gate - Security Booth',
            'Building D - Roof Access',
            'Warehouse - Loading Bay',
            'Admin Building - Rear Entrance'
        ]

        if qr_data in valid_locations:
            return Response({
                'success': True,
                'type': 'location',
                'location': qr_data,
                'message': 'Location QR code validated successfully'
            })

        # If neither member, house, nor location, it's invalid
        return Response({
            'success': False,
            'message': 'Invalid QR code - not a recognized member, house, or location'
        })

    except Exception as e:
        logger.exception("Error validating QR")
        return Response({'error': f'Validation failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def security_update_progress(request):
    logger.info(f"Progress update requested by {request.user.email}")
    try:
        data = request.data
        route_id = data.get('route_id')
        checkpoint_id = data.get('checkpoint_id')

        if not route_id or not checkpoint_id:
            return Response({'error': 'route_id and checkpoint_id are required'}, status=status.HTTP_400_BAD_REQUEST)

        # Mock progress update - in real app, update database
        return Response({'success': True, 'message': 'Progress updated'})

    except Exception as e:
        logger.exception("Error updating progress")
        return Response({'error': f'Update failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def security_scan_qr(request):
    logger.info(f"QR scan requested by {request.user.email}")
    try:
        data = request.data
        qr_data = data.get('qr_data')
        comment = data.get('comment', '')
        scan_status = data.get('scan_status', 'completed')
        latitude = data.get('latitude')
        longitude = data.get('longitude')

        if not qr_data:
            return Response({'error': 'qr_data is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Get security profile
        profile = SecurityProfile.objects.get(user=request.user)

        # Validate the QR code inline
        validation_result = validate_qr_data(qr_data, profile)
        if not validation_result['success']:
            return Response({'error': f'Validation failed: {validation_result["message"]}'}, status=status.HTTP_400_BAD_REQUEST)

        # Log the scan
        scan_log = ScanLog.objects.create(
            security_guard=profile,
            qr_data=qr_data,
            comment=comment,
            location=validation_result.get('location') or validation_result.get('member', {}).get('address', ''),
        )

        # Update compliance if it's a member checkpoint scan
        if validation_result.get('type') == 'member_checkpoint':
            from adminstrator.models import SecurityCompliance
            from datetime import date

            today = date.today()
            compliance, created = SecurityCompliance.objects.get_or_create(
                security_guard=profile,
                date=today,
                defaults={
                    'shift_start': '09:00:00',  # Default shift start
                    'shift_end': '17:00:00',    # Default shift end
                    'patrols_completed': 0,
                    'incidents_reported': 0,
                    'tasks_completed': 0,
                    'total_tasks_assigned': 5,  # Default tasks
                    'on_time': True,
                    'notes': '',
                }
            )

            # Increment patrols and tasks completed
            compliance.patrols_completed += 1
            compliance.tasks_completed += 1
            compliance.save()

            logger.info(f"Updated compliance for {request.user.email}: patrols_completed = {compliance.patrols_completed}, tasks_completed = {compliance.tasks_completed}")

        logger.info(f"Scan completed for {request.user.email}: {qr_data}")
        return Response({
            'success': True,
            'message': 'Scan logged successfully',
            'scan_id': scan_log.id,
            'validation': validation_result
        }, status=status.HTTP_201_CREATED)

    except SecurityProfile.DoesNotExist:
        logger.error(f"Profile not found for {request.user.email}")
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.exception("Error processing scan")
        return Response({'error': f'Scan failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def security_log_scan(request):
    logger.info(f"Scan logging requested by {request.user.email}")
    try:
        data = request.data
        profile = SecurityProfile.objects.get(user=request.user)

        ScanLog.objects.create(
            security_guard=profile,
            qr_data=data.get('qr_data'),
            comment=data.get('comment', ''),
            location=data.get('location', ''),
        )

        logger.info(f"Scan logged for {request.user.email}: {data.get('location')}")
        return Response({'success': True}, status=status.HTTP_201_CREATED)

    except SecurityProfile.DoesNotExist:
        logger.error(f"Profile not found for {request.user.email}")
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.exception("Error logging scan")
        return Response({'error': f'Logging failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def security_compliance(request):
    logger.info(f"Compliance data requested by {request.user.email}")
    try:
        profile = SecurityProfile.objects.get(user=request.user)
        logger.debug(f"Getting compliance data for {request.user.email}")

        # Get today's compliance record or create default
        from datetime import date
        today = date.today()

        try:
            compliance = SecurityCompliance.objects.filter(
                security_guard=profile,
                date=today
            ).first()

            if compliance:
                compliance_data = {
                    'compliance_rate': round(compliance.compliance_score, 1),
                    'completed_patrols': compliance.patrols_completed,
                    'incidents_reported': compliance.incidents_reported,
                    'tasks_completed': compliance.tasks_completed,
                    'total_tasks': compliance.total_tasks_assigned,
                    'on_time': compliance.on_time,
                }
            else:
                # Default values if no record exists
                compliance_data = {
                    'compliance_rate': 0.0,
                    'completed_patrols': 0,
                    'incidents_reported': 0,
                    'tasks_completed': 0,
                    'total_tasks': 0,
                    'on_time': True,
                }
        except Exception as e:
            logger.warning(f"Error getting compliance data: {e}")
            compliance_data = {
                'compliance_rate': 0.0,
                'completed_patrols': 0,
                'incidents_reported': 0,
                'tasks_completed': 0,
                'total_tasks': 0,
                'on_time': True,
            }

        # Calculate compliance metrics
        on_time_patrols = 100.0 if compliance_data['on_time'] else 0.0
        incident_reports = min(100.0, compliance_data['incidents_reported'] * 20.0)  # Assume up to 5 incidents = 100%
        equipment_check = 100.0 if compliance_data['total_tasks'] > 0 and compliance_data['tasks_completed'] == compliance_data['total_tasks'] else 0.0
        client_feedback = 85.0  # Mock value for now

        return Response({
            'compliance_rate': compliance_data['compliance_rate'],
            'completed_patrols': compliance_data['completed_patrols'],
            'compliance_metrics': {
                'on_time_patrols': round(on_time_patrols, 1),
                'incident_reports': round(incident_reports, 1),
                'equipment_check': round(equipment_check, 1),
                'client_feedback': client_feedback,
            }
        })

    except SecurityProfile.DoesNotExist:
        logger.error(f"Profile not found for {request.user.email}")
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def security_route(request):
    logger.info(f"Route data requested by {request.user.email}")
    try:
        profile = SecurityProfile.objects.get(user=request.user)

        # Get assigned route
        try:
            route = profile.assigned_routes.first()  # Get the first assigned route
            if route:
                checkpoints = []
                for member in route.checkpoints.all():
                    checkpoints.append({
                        'id': member.id,
                        'full_name': member.full_name,
                        'address': member.address,
                        'qr_code_data': member.qr_code_data,
                    })

                route_data = {
                    'id': route.id,
                    'name': route.name,
                    'description': route.description,
                    'checkpoints': checkpoints,
                    'total_checkpoints': len(checkpoints),
                }
            else:
                route_data = None
        except Exception as e:
            logger.warning(f"Error getting route data: {e}")
            route_data = None

        # Get recent scans for progress tracking
        from datetime import date, timedelta
        today = date.today()
        recent_scans = ScanLog.objects.filter(
            security_guard=profile,
            scanned_at__date__gte=today - timedelta(days=1)  # Last 24 hours
        ).values_list('qr_data', flat=True)

        return Response({
            'route': route_data,
            'recent_scans': list(recent_scans),
        })

    except SecurityProfile.DoesNotExist:
        logger.error(f"Profile not found for {request.user.email}")
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_panic_alerts(request):
    logger.info(f"Panic alerts requested by {request.user.email}")
    try:
        # Only security personnel can access this
        SecurityProfile.objects.get(user=request.user)

        # Get active panic alerts
        alerts = PanicAlert.objects.filter(status='active').order_by('-timestamp')

        alert_data = []
        for alert in alerts:
            alert_data.append({
                'id': alert.id,
                'member_name': alert.member.get_full_name(),
                'member_email': alert.member.email,
                'address': alert.address,
                'timestamp': alert.timestamp.isoformat(),
                'status': alert.status
            })

        return Response({
            'success': True,
            'alerts': alert_data
        })

    except SecurityProfile.DoesNotExist:
        logger.warning(f"Non-security user {request.user.email} tried to access panic alerts")
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    except Exception as e:
        logger.exception(f"Error getting panic alerts for {request.user.email}")
        return Response({'error': f'Failed to get alerts: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def resolve_panic_alert(request):
    logger.info(f"Panic alert resolution requested by {request.user.email}")
    try:
        data = request.data
        alert_id = data.get('alert_id')
        alert_status = data.get('status')  # 'resolved' or 'false_alarm'
        notes = data.get('notes', '')

        if not alert_id or alert_status not in ['resolved', 'false_alarm']:
            return Response({'error': 'alert_id and valid status required'}, status=status.HTTP_400_BAD_REQUEST)

        # Only security personnel can resolve
        profile = SecurityProfile.objects.get(user=request.user)

        alert = PanicAlert.objects.get(id=alert_id)
        alert.status = alert_status
        alert.resolved_by = request.user
        alert.resolved_at = timezone.now()
        alert.notes = notes
        alert.save()

        logger.info(f"Panic alert {alert_id} resolved by {request.user.email} as {alert_status}")

        return Response({
            'success': True,
            'message': f'Alert marked as {alert_status}'
        })

    except SecurityProfile.DoesNotExist:
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    except PanicAlert.DoesNotExist:
        return Response({'error': 'Alert not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.exception(f"Error resolving panic alert")
        return Response({'error': f'Failed to resolve alert: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
