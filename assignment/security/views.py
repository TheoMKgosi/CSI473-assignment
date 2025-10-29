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
from .models import SecurityProfile

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
            for _ in range(10):  # Avoid infinite loop
                timestamp_part = str(int(time.time()))[-4:]
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
            email=data['email'],
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
