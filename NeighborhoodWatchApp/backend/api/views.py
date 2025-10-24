from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import UserProfile
from rest_framework.authtoken.models import Token
from django.utils import timezone

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
email = request.data.get('email')
password = request.data.get('password')
full_name = request.data.get('full_name')
phone = request.data.get('phone')
address = request.data.get('address')
try:
    if not all([email, password, full_name, phone, address]):
        return Response({'errors': 'All fields are required'}, status=400)
    if User.objects.filter(email=email).exists():
        return Response({'errors': 'Email already exists'}, status=400)
    user = User.objects.create_user(username=email, email=email, password=password)
    UserProfile.objects.create(user=user, full_name=full_name, phone=phone, address=address, is_approved=False)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'success': True, 'token': token.key}, status=201)
except Exception as e:
    return Response({'errors': str(e)}, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
email = request.data.get('email')
password = request.data.get('password')
try:
    user = User.objects.get(email=email)
    if user.check_password(password):
        if not user.userprofile.is_approved:
            return Response({'errors': 'Account not approved'}, status=403)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'success': True, 'token': token.key}, status=200)
    return Response({'errors': 'Invalid credentials'}, status=401)
except User.DoesNotExist:
    return Response({'errors': 'User not found'}, status=404)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def forum(request):
if request.method == 'GET':
    posts = [{'id': 1, 'user': {'email': 'test@example.com'}, 'content': 'Sample post', 'likes': 0}]
    return Response(posts, status=200)
elif request.method == 'POST':
    content = request.data.get('content')
    if not content:
        return Response({'errors': 'Content is required'}, status=400)
    return Response({'id': 2, 'user': {'email': request.user.email}, 'content': content, 'likes': 0}, status=201)

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