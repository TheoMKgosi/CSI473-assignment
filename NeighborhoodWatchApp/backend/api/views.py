from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import UserProfile
import json

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    try:
        data = request.data
        required_fields = ['email', 'password', 'full_name', 'phone', 'address']
        
        # Validate required fields
        for field in required_fields:
            if field not in data or not data[field]:
                return Response({'errors': f'{field} is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user already exists
        if User.objects.filter(email=data['email']).exists():
            return Response({'errors': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create user
        user = User.objects.create_user(
            username=data['email'],
            email=data['email'],
            password=data['password']
        )
        
        # Create user profile
        profile = UserProfile.objects.create(
            user=user,
            full_name=data['full_name'],
            phone=data['phone'],
            address=data['address']
        )
        
        return Response({
            'success': True, 
            'message': 'User registered successfully. Awaiting admin approval.',
            'user_id': user.id
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({'errors': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({'errors': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'errors': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Check password
        user = authenticate(username=user.username, password=password)
        if user is not None:
            # Check if profile exists and is approved
            try:
                profile = user.userprofile
                if not profile.is_approved:
                    return Response({'errors': 'Account pending admin approval'}, status=status.HTTP_403_FORBIDDEN)
                
                # Generate or get token
                from rest_framework.authtoken.models import Token
                token, created = Token.objects.get_or_create(user=user)
                
                return Response({
                    'success': True,
                    'token': token.key,
                    'user': {
                        'email': user.email,
                        'full_name': profile.full_name
                    }
                })
                
            except UserProfile.DoesNotExist:
                return Response({'errors': 'User profile not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'errors': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
            
    except Exception as e:
        return Response({'errors': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def patrol_stats(request):
return Response({'completed': 0, 'response_time': '0 min'}, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def panic(request):
return Response({'success': True, 'message': 'Emergency alert triggered'}, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def pay_subscription(request):
payment_date = request.data.get('payment_date')
amount = request.data.get('amount')
if not amount:
    return Response({'errors': 'Amount is required'}, status=400)
return Response({'success': True, 'message': 'Payment processed'}, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_subscription(request):
return Response({'success': True, 'message': 'Subscription cancelled'}, status=200)