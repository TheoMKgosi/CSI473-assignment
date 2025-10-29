from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import SecurityProfile
import random
import string

@api_view(['POST'])
@permission_classes([AllowAny])
def security_signup(request):
    data = request.data
    required_fields = ['email', 'password', 'phone_number', 'address', 'date_of_birth']
    for field in required_fields:
        if field not in data or not data[field]:
            return Response({'error': f'{field} is required'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(email=data['email']).exists():
        return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
    # Systematic employee ID: SEC + 6 random digits
    def generate_employee_id():
        while True:
            eid = 'SEC' + ''.join(random.choices(string.digits, k=6))
            if not SecurityProfile.objects.filter(employee_id=eid).exists():
                return eid
    employee_id = generate_employee_id()
    user = User.objects.create_user(
        username=data['email'],
        email=data['email'],
        password=data['password']
    )
    profile = SecurityProfile.objects.create(
        user=user,
        email=data['email'],
        phone_number=data['phone_number'],
        address=data['address'],
        date_of_birth=data['date_of_birth'],
        employee_id=employee_id
    )
    return Response({'success': True, 'message': 'Account created. Awaiting approval.', 'employee_id': employee_id}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny])
def security_login(request):
    data = request.data
    employee_id = data.get('employee_id')
    password = data.get('password')
    if not employee_id or not password:
        return Response({'error': 'Employee ID and password are required'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        profile = SecurityProfile.objects.get(employee_id=employee_id)
        user = profile.user
    except SecurityProfile.DoesNotExist:
        return Response({'error': 'Invalid employee ID or password'}, status=status.HTTP_401_UNAUTHORIZED)
    user = authenticate(username=user.username, password=password)
    if user is not None:
        if profile.status == 'approved':
            return Response({'success': True, 'message': 'Login successful', 'employee_id': profile.employee_id}, status=status.HTTP_200_OK)
        elif profile.status == 'pending':
            return Response({'error': 'Account pending approval'}, status=status.HTTP_403_FORBIDDEN)
        elif profile.status == 'rejected':
            return Response({'error': 'Account rejected'}, status=status.HTTP_403_FORBIDDEN)
    else:
        return Response({'error': 'Invalid employee ID or password'}, status=status.HTTP_401_UNAUTHORIZED)

@login_required
def security_dashboard(request):
    """Security personnel dashboard view"""
    return render(request, 'security/dashboard.html')

def security_logout(request):
    """Handle security personnel logout"""
    logout(request)
    messages.info(request, 'You have been logged out.')
    return redirect('security:security_login')
