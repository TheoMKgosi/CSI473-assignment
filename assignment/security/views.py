# security/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import SecurityProfile
from .forms import SecuritySignupForm
import random
import string
from rest_framework.authtoken.models import Token

@api_view(['POST'])
@permission_classes([AllowAny])
def security_signup(request):
    try:
        data = request.data
        
        # Check required fields
        required_fields = ['first_name', 'last_name', 'email', 'password']
        for field in required_fields:
            if field not in data or not data[field]:
                return Response(
                    {'error': f'{field} is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Check if email already exists
        if User.objects.filter(email=data['email']).exists():
            return Response(
                {'error': 'Email already exists'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Generate employee ID
        def generate_employee_id():
            while True:
                eid = 'SEC' + ''.join(random.choices(string.digits, k=6))
                if not SecurityProfile.objects.filter(employee_id=eid).exists():
                    return eid
        
        employee_id = generate_employee_id()
        
        # Create user
        user = User.objects.create_user(
            username=data['email'],  # Use email as username
            email=data['email'],
            password=data['password'],
            first_name=data['first_name'],
            last_name=data['last_name']
        )
        
        # Create security profile
        profile = SecurityProfile.objects.create(
            user=user,
            email=data['email'],
            phone_number=data.get('phone_number', ''),
            address=data.get('address', ''),
            date_of_birth=data.get('date_of_birth'),
            employee_id=employee_id,
            status='pending'  # Default status
        )
        
        return Response({
            'success': True, 
            'message': 'Account created successfully. Awaiting approval.', 
            'employee_id': employee_id
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {'error': f'Signup failed: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def security_login(request):
    try:
        data = request.data
        
        # Accept both email and employee_id for login
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return Response(
                {'error': 'Email and password are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Try to find user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'error': 'Invalid email or password'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Authenticate user
        user = authenticate(username=user.username, password=password)
        if user is None:
            return Response(
                {'error': 'Invalid email or password'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Check security profile status
        try:
            profile = SecurityProfile.objects.get(user=user)
            if profile.status != 'approved':
                return Response({
                    'error': f'Account is {profile.status}. Please contact administrator.'
                }, status=status.HTTP_403_FORBIDDEN)
        except SecurityProfile.DoesNotExist:
            return Response(
                {'error': 'Security profile not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Generate or get token
        token, created = Token.objects.get_or_create(user=user)
        
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
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Login failed: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def security_profile(request):
    """Get security officer profile"""
    try:
        profile = SecurityProfile.objects.get(user=request.user)
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
        return Response(
            {'error': 'Profile not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )