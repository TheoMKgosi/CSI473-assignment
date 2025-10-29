import logging
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import UserProfile

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

        UserProfile.objects.create(
            user=user,
            full_name=data['full_name'],
            phone=data['phone'],
            address=data['address']
        )
        logger.debug(f"Profile created for {user.email}")

        return Response({
            'success': True,
            'message': 'User registered successfully. Awaiting admin approval.',
            'user_id': user.id
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
                if not profile.is_approved:
                    logger.warning(f"User {email} not approved yet.")
                    return Response({'errors': 'Account pending admin approval'}, status=status.HTTP_403_FORBIDDEN)
                
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
    payment_date = request.data.get('payment_date')
    amount = request.data.get('amount')
    if not amount:
        logger.warning("Payment attempt with missing amount")
        return Response({'errors': 'Amount is required'}, status=400)
    logger.debug(f"Payment details: amount={amount}, date={payment_date}")
    return Response({'success': True, 'message': 'Payment processed'}, status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_subscription(request):
    logger.info(f"Subscription cancelled by {request.user.email}")
    return Response({'success': True, 'message': 'Subscription cancelled'}, status=200)
