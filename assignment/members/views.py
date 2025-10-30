import logging
import qrcode
from io import BytesIO
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.core.files import File
from datetime import date, timedelta
from .models import UserProfile
from adminstrator.models import Subscription, House

# --- Setup logger ---
logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    logger.info("Signup attempt received.")
    try:
        data = request.data
        logger.debug(f"Signup data received: {data}")

        required_fields = ['email', 'password', 'full_name', 'phone', 'address']
        for field in required_fields:
            if field not in data or not data[field]:
                logger.warning(f"Missing required field: {field}")
                return Response({'errors': f'{field} is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=data['email']).exists():
            logger.warning(f"Duplicate signup attempt for email: {data['email']}")
            return Response({'errors': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(
            username=data['email'],
            email=data['email'],
            password=data['password']
        )
        logger.info(f"User created successfully: {user.email}")

        profile = UserProfile.objects.create(
            user=user,
            full_name=data['full_name'],
            phone=data['phone'],
            address=data['address']
        )
        logger.debug(f"Profile created for {user.email}")

        # Generate QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(f"member:{user.id}")
        qr.make(fit=True)

        img = qr.make_image(fill='black', back_color='white')
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)

        profile.qr_code.save(f"qr_{user.id}.png", File(buffer), save=True)
        logger.debug(f"QR code generated for {user.email}")

        return Response({
            'success': True,
            'message': 'User registered successfully. Awaiting admin approval.',
            'user_id': user.id,
            'qr_code_url': profile.qr_code.url if profile.qr_code else None
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.exception("Error during signup")
        return Response({'errors': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    logger.info("Login attempt received.")
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        logger.debug(f"Login credentials: {email}")

        if not email or not password:
            logger.warning("Missing email or password")
            return Response({'errors': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            logger.warning(f"Invalid login attempt for email: {email}")
            return Response({'errors': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
        
        user = authenticate(username=user.username, password=password)
        if user is not None:
            logger.info(f"User authenticated: {email}")
            try:
                profile = user.userprofile
                if profile.status != 'approved':
                    logger.warning(f"User {email} account status: {profile.status}")
                    if profile.status == 'pending':
                        return Response({'errors': 'Account pending admin approval'}, status=status.HTTP_403_FORBIDDEN)
                    elif profile.status == 'rejected':
                        return Response({'errors': 'Account has been rejected'}, status=status.HTTP_403_FORBIDDEN)
                    else:
                        return Response({'errors': 'Account status unknown'}, status=status.HTTP_403_FORBIDDEN)
                
                from rest_framework.authtoken.models import Token
                token, created = Token.objects.get_or_create(user=user)
                logger.debug(f"Token generated for {email}")

                return Response({
                    'success': True,
                    'token': token.key,
                    'user': {
                        'email': user.email,
                        'full_name': profile.full_name
                    }
                })
            except UserProfile.DoesNotExist:
                logger.error(f"UserProfile not found for {email}")
                return Response({'errors': 'User profile not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            logger.warning(f"Authentication failed for {email}")
            return Response({'errors': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        logger.exception("Error during login")
        return Response({'errors': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def forum(request):
    logger.info(f"Forum endpoint hit with {request.method} by {request.user.email}")
    if request.method == 'GET':
        posts = [
            {'id': 1, 'user': {'email': 'user1@example.com'}, 'content': 'Welcome to the community forum!', 'likes': 5, 'time': '2 hours ago'},
            {'id': 2, 'user': {'email': 'user2@example.com'}, 'content': 'Has anyone seen any suspicious activity near the park?', 'likes': 3, 'time': '5 hours ago'}
        ]
        return Response(posts)
    else:
        content = request.data.get('content', '')
        if not content:
            logger.warning("Post creation attempted with no content")
            return Response({'errors': 'Content is required'}, status=status.HTTP_400_BAD_REQUEST)
        new_post = {'id': 3, 'user': {'email': request.user.email}, 'content': content, 'likes': 0, 'time': 'Just now'}
        logger.debug(f"New forum post created: {new_post}")
        return Response(new_post, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def patrol_stats(request):
    logger.info(f"Patrol stats requested by {request.user.email}")
    stats = {'completed': 12, 'response_time': '4.2 min', 'coverage': 85, 'incidents': 2}
    return Response(stats, status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def panic(request):
    logger.warning(f"Emergency alert triggered by {request.user.email}")
    return Response({'success': True, 'message': 'Emergency alert triggered'}, status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def pay_subscription(request):
    logger.info(f"Subscription payment attempt by {request.user.email}")
    try:
        data = request.data
        subscription_type = data.get('subscription_type', 'premium')
        amount = data.get('amount')

        if not amount:
            logger.warning("Payment attempt with missing amount")
            return Response({'errors': 'Amount is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate subscription type
        if subscription_type not in ['basic', 'premium', 'enterprise']:
            logger.warning(f"Invalid subscription type: {subscription_type}")
            return Response({'errors': 'Invalid subscription type'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user already has an active subscription
        existing_subscription = Subscription.objects.filter(
            user=request.user,
            status__in=['active', 'pending']
        ).first()

        if existing_subscription:
            logger.warning(f"User {request.user.email} already has an active subscription")
            return Response({'errors': 'You already have an active subscription'}, status=status.HTTP_400_BAD_REQUEST)

        # Get user's house (assuming they have one, or create a default)
        try:
            house = House.objects.filter(owner=request.user).first()
            if not house:
                # Create a default house if none exists
                house = House.objects.create(
                    address=request.user.userprofile.address,
                    owner=request.user,
                    house_number=f"USER_{request.user.id}",
                    bedrooms=1,
                    bathrooms=1,
                    square_footage=1000,
                    property_type='house'
                )
                logger.info(f"Created default house for {request.user.email}")
        except Exception as e:
            logger.error(f"Error getting/creating house for {request.user.email}: {e}")
            return Response({'errors': 'Unable to process subscription'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Calculate subscription dates
        start_date = date.today()
        if subscription_type == 'basic':
            end_date = start_date + timedelta(days=365)  # 1 year
            monthly_fee = 0
        elif subscription_type == 'premium':
            end_date = start_date + timedelta(days=30)  # 1 month
            monthly_fee = 100
        else:  # enterprise
            end_date = start_date + timedelta(days=30)  # 1 month
            monthly_fee = 500

        # Create subscription
        subscription = Subscription.objects.create(
            user=request.user,
            house=house,
            subscription_type=subscription_type,
            status='active',
            start_date=start_date,
            end_date=end_date,
            monthly_fee=monthly_fee
        )

        logger.info(f"Subscription created for {request.user.email}: {subscription_type}")
        return Response({
            'success': True,
            'message': 'Subscription activated successfully',
            'subscription': {
                'id': subscription.id,
                'type': subscription_type,
                'status': 'active',
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat(),
                'monthly_fee': monthly_fee
            }
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.exception(f"Error processing subscription payment for {request.user.email}")
        return Response({'errors': f'Payment processing failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_subscription(request):
    logger.info(f"Subscription status requested by {request.user.email}")
    try:
        subscription = Subscription.objects.filter(user=request.user).order_by('-created_at').first()

        if not subscription:
            return Response({
                'has_subscription': False,
                'subscription_type': 'basic',
                'status': 'none'
            }, status=status.HTTP_200_OK)

        return Response({
            'has_subscription': True,
            'subscription': {
                'id': subscription.id,
                'type': subscription.subscription_type,
                'status': subscription.status,
                'start_date': subscription.start_date.isoformat(),
                'end_date': subscription.end_date.isoformat(),
                'monthly_fee': subscription.monthly_fee,
                'created_at': subscription.created_at.isoformat()
            }
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.exception(f"Error getting subscription for {request.user.email}")
        return Response({'errors': f'Failed to get subscription: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_subscription(request):
    logger.info(f"Subscription cancellation attempt by {request.user.email}")
    try:
        # Find active subscription
        subscription = Subscription.objects.filter(
            user=request.user,
            status='active'
        ).first()

        if not subscription:
            logger.warning(f"No active subscription found for {request.user.email}")
            return Response({'errors': 'No active subscription found'}, status=status.HTTP_404_NOT_FOUND)

        # Cancel the subscription
        subscription.status = 'cancelled'
        subscription.save()

        logger.info(f"Subscription cancelled for {request.user.email}")
        return Response({
            'success': True,
            'message': 'Subscription cancelled successfully',
            'subscription': {
                'id': subscription.id,
                'status': 'cancelled',
                'end_date': subscription.end_date.isoformat()
            }
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.exception(f"Error cancelling subscription for {request.user.email}")
        return Response({'errors': f'Cancellation failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
