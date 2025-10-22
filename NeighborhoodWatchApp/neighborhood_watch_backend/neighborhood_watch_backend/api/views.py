from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.utils import timezone
from .serializers import UserSerializer, UserProfileSerializer, ForumPostSerializer, PatrolStatSerializer, EmergencyAlertSerializer
from .models import UserProfile, ForumPost, PatrolStat, EmergencyAlert
from twilio.rest import Client

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(username=email, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'success': True, 'token': token.key})
    return Response({'success': False})

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    serializer = UserSerializer(data={'email': request.data['email'], 'password': request.data['password']})
    if serializer.is_valid():
        user = serializer.save()
        UserProfile.objects.create(
            user=user,
            full_name=request.data['full_name'],
            phone=request.data['phone'],
            address=request.data['address']
        )
        return Response({'success': True})
    return Response({'success': False, 'errors': serializer.errors})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    serializer = ForumPostSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data)
    return Response(serializer.errors)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_stats(request):
    stats = PatrolStat.objects.first() or PatrolStat.objects.create()
    serializer = PatrolStatSerializer(stats)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def trigger_panic(request):
    alert = EmergencyAlert.objects.create(user=request.user)
    # Comment out Twilio for now
    # client = Client('YOUR_TWILIO_SID', 'YOUR_TWILIO_AUTH_TOKEN')
    # client.messages.create(
    #     body='Emergency Alert from Neighborhood Watch!',
    #     from_='YOUR_TWILIO_PHONE_NUMBER',
    #     to=request.user.userprofile.phone
    # )
    return Response({'success': True})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def pay_subscription(request):
    amount = request.data.get('amount')
    user_profile = UserProfile.objects.get(user=request.user)
    user_profile.subscription_active = True
    user_profile.last_payment_date = timezone.now().date()
    user_profile.save()
    return Response({'success': True})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_subscription(request):
    user_profile = UserProfile.objects.get(user=request.user)
    user_profile.subscription_active = False
    user_profile.save()
    return Response({'success': True})