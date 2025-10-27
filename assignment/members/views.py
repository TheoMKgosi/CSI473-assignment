from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .forms import MemberSignupForm, MemberLoginForm
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .models import MemberProfile, PanicEvent
from adminstrator.models import Subscription

def member_signup(request):
    """Handle member registration"""
    if request.method == 'POST':
        form = MemberSignupForm(request.POST)
        if form.is_valid():
            user = form.save()
            messages.success(request, 'Account created successfully! Please wait for administrator approval.')
            return redirect('members:member_login')
    else:
        form = MemberSignupForm()
    return render(request, 'members/signup.html', {'form': form})

def member_login(request):
    """Handle member login"""
    if request.method == 'POST':
        form = MemberLoginForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                # Check if user has member profile and is approved
                try:
                    member_profile = user.member_profile
                    if member_profile.status == 'approved':
                        login(request, user)
                        messages.success(request, f'Welcome back, {username}!')
                        return redirect('members:member_dashboard')
                    elif member_profile.status == 'pending':
                        messages.error(request, 'Your account is pending administrator approval.')
                    elif member_profile.status == 'rejected':
                        messages.error(request, 'Your account has been rejected. Please contact an administrator.')
                except AttributeError:
                    messages.error(request, 'No member profile found for this account.')
            else:
                messages.error(request, 'Invalid username or password.')
        else:
            messages.error(request, 'Invalid username or password.')
    else:
        form = MemberLoginForm()
    return render(request, 'members/login.html', {'form': form})

@login_required
def member_dashboard(request):
    """Member dashboard view"""
    return render(request, 'members/dashboard.html')

def member_logout(request):
    """Handle member logout"""
    logout(request)
    messages.info(request, 'You have been logged out.')
    return redirect('members:member_login')

# API Views for mobile app integration

@api_view(['POST'])
@permission_classes([AllowAny])
def api_signup(request):
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
        user = User.objects.create_user(username=email, email=email, password=password, first_name=full_name)
        MemberProfile.objects.create(user=user, phone_number=phone, address=address, status='pending')
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'success': True, 'token': token.key}, status=201)
    except Exception as e:
        return Response({'errors': str(e)}, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def api_login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    try:
        user = User.objects.get(email=email)
        if user.check_password(password):
            if not hasattr(user, 'member_profile') or user.member_profile.status != 'approved':
                return Response({'errors': 'Account not approved'}, status=403)
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'success': True, 'token': token.key}, status=200)
        return Response({'errors': 'Invalid credentials'}, status=401)
    except User.DoesNotExist:
        return Response({'errors': 'User not found'}, status=404)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def api_forum(request):
    if request.method == 'GET':
        # Stub: return sample posts
        posts = [{'id': 1, 'user': {'email': 'test@example.com'}, 'content': 'Sample post', 'likes': 0}]
        return Response(posts, status=200)
    elif request.method == 'POST':
        content = request.data.get('content')
        if not content:
            return Response({'errors': 'Content is required'}, status=400)
        return Response({'id': 2, 'user': {'email': request.user.email}, 'content': content, 'likes': 0}, status=201)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_patrol_stats(request):
    # Return stats based on user's panic events or subscriptions
    panic_count = PanicEvent.objects.filter(member=request.user.member_profile).count()
    return Response({'completed': panic_count, 'response_time': '0 min'}, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_panic(request):
    location_lat = request.data.get('location_lat')
    location_lng = request.data.get('location_lng')
    address = request.data.get('address')
    emergency_type = request.data.get('emergency_type', 'general')
    description = request.data.get('description', '')
    try:
        PanicEvent.objects.create(
            member=request.user.member_profile,
            location_lat=location_lat,
            location_lng=location_lng,
            address=address,
            emergency_type=emergency_type,
            description=description
        )
        return Response({'success': True, 'message': 'Emergency alert triggered'}, status=200)
    except Exception as e:
        return Response({'errors': str(e)}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_pay_subscription(request):
    payment_date = request.data.get('payment_date')
    amount = request.data.get('amount')
    subscription_type = request.data.get('subscription_type', 'basic')
    if not amount:
        return Response({'errors': 'Amount is required'}, status=400)
    try:
        # Create or update subscription
        subscription, created = Subscription.objects.get_or_create(
            user=request.user,
            defaults={
                'subscription_type': subscription_type,
                'status': 'active',
                'start_date': payment_date,
                'end_date': payment_date,  # Placeholder
                'monthly_fee': amount
            }
        )
        if not created:
            subscription.status = 'active'
            subscription.monthly_fee = amount
            subscription.save()
        return Response({'success': True, 'message': 'Payment processed'}, status=200)
    except Exception as e:
        return Response({'errors': str(e)}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_cancel_subscription(request):
    try:
        subscription = Subscription.objects.filter(user=request.user, status='active').first()
        if subscription:
            subscription.status = 'cancelled'
            subscription.save()
        return Response({'success': True, 'message': 'Subscription cancelled'}, status=200)
    except Exception as e:
        return Response({'errors': str(e)}, status=400)
