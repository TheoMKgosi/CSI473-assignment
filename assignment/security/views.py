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
from rest_framework.authtoken.models import Token
from .models import SecurityProfile, ScanLog
from adminstrator.models import SecurityCompliance

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




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def security_validate_qr(request):
    logger.info(f"QR validation requested by {request.user.email}")
    try:
        data = request.data
        qr_data = data.get('qr_data')

        if not qr_data:
            return Response({'error': 'qr_data is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Mock validation logic - any valid location
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
                'location': qr_data,
                'message': 'QR code validated successfully'
            })
        else:
            return Response({
                'success': False,
                'message': 'Invalid QR code'
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
