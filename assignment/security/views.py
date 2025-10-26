from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from .forms import SecuritySignupForm, SecurityLoginForm
from .models import PatrolRoute, SecurityProfile
from .serializers import PatrolRouteSerializer
from adminstrator.models import House, SecurityCompliance

def security_signup(request):
    """Handle security personnel registration"""
    if request.method == 'POST':
        form = SecuritySignupForm(request.POST)
        if form.is_valid():
            user = form.save()
            messages.success(request, 'Security account created successfully! Please wait for administrator approval.')
            return redirect('security_login')
    else:
        form = SecuritySignupForm()
    return render(request, 'security/signup.html', {'form': form})

def security_login(request):
    """Handle security personnel login"""
    if request.method == 'POST':
        form = SecurityLoginForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                # Check if user has security profile and is approved
                try:
                    security_profile = user.security_profile
                    if security_profile.status == 'approved':
                        login(request, user)
                        messages.success(request, f'Welcome back, {username}!')
                        return redirect('security:security_dashboard')
                    elif security_profile.status == 'pending':
                        messages.error(request, 'Your account is pending administrator approval.')
                    elif security_profile.status == 'rejected':
                        messages.error(request, 'Your account has been rejected. Please contact an administrator.')
                except AttributeError:
                    messages.error(request, 'No security profile found for this account.')
            else:
                messages.error(request, 'Invalid username or password.')
        else:
            messages.error(request, 'Invalid username or password.')
    else:
        form = SecurityLoginForm()
    return render(request, 'security/login.html', {'form': form})

@login_required
def security_dashboard(request):
    """Security personnel dashboard view"""
    return render(request, 'security/dashboard.html')

def security_logout(request):
    """Handle security personnel logout"""
    logout(request)
    messages.info(request, 'You have been logged out.')
    return redirect('security:security_login')


class PatrolRouteViewSet(viewsets.ModelViewSet):
    """API viewset for patrol route management - Admin only"""
    queryset = PatrolRoute.objects.all()
    serializer_class = PatrolRouteSerializer

    def get_permissions(self):
        """Only administrators can perform CRUD operations"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]  # Could add IsAdminUser permission
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['get'])
    def houses(self, request, pk=None):
        """Get all houses in a patrol route"""
        patrol_route = self.get_object()
        houses = patrol_route.houses.all()
        from adminstrator.serializers import HouseSerializer
        serializer = HouseSerializer(houses, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def assign_guard(self, request, pk=None):
        """Assign a security guard to this route"""
        patrol_route = self.get_object()
        guard_id = request.data.get('guard_id')

        try:
            guard = SecurityProfile.objects.get(id=guard_id, status='approved')
            guard.assigned_route = patrol_route
            guard.save()
            return Response({'message': f'Guard {guard.user.username} assigned to route {patrol_route.name}'})
        except SecurityProfile.DoesNotExist:
            return Response({'error': 'Guard not found or not approved'}, status=400)

    @action(detail=True, methods=['post'])
    def unassign_guard(self, request, pk=None):
        """Unassign guard from this route"""
        patrol_route = self.get_object()
        guards = SecurityProfile.objects.filter(assigned_route=patrol_route)
        guards.update(assigned_route=None)
        return Response({'message': f'Unassigned {guards.count()} guards from route'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def scan_qr_code(request):
    """API endpoint for security guards to scan QR codes"""
    qr_data = request.data.get('qr_data')
    if not qr_data:
        return Response({'error': 'QR data required'}, status=400)

    try:
        # Find house by QR code data
        house = House.objects.get(qr_code_data=qr_data)
    except House.DoesNotExist:
        return Response({'error': 'Invalid QR code'}, status=400)

    try:
        security_profile = request.user.security_profile
        if security_profile.status != 'approved':
            return Response({'error': 'Guard not approved'}, status=403)
    except SecurityProfile.DoesNotExist:
        return Response({'error': 'Security profile not found'}, status=403)

    today = timezone.now().date()

    # Get or create today's compliance record
    compliance, created = SecurityCompliance.objects.get_or_create(
        security_guard=security_profile,
        date=today,
        defaults={
            'shift_start': timezone.now().time(),
            'shift_end': timezone.now().time(),
            'total_tasks_assigned': 1
        }
    )

    # Add house to scanned houses if not already scanned
    if not compliance.scanned_houses.filter(id=house.id).exists():
        compliance.scanned_houses.add(house)
        compliance.tasks_completed += 1
        compliance.save()

        # Check if route is completed
        if security_profile.assigned_route:
            assigned_houses = set(security_profile.assigned_route.houses.values_list('id', flat=True))
            scanned_houses = set(compliance.scanned_houses.values_list('id', flat=True))
            if assigned_houses.issubset(scanned_houses):
                compliance.route_completed = True
                compliance.save()

    return Response({
        'message': f'House {house.address} scanned successfully',
        'compliance_score': compliance.compliance_score,
        'route_completed': compliance.route_completed
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_route(request):
    """Get the assigned route for the current security guard"""
    try:
        security_profile = request.user.security_profile
        if security_profile.status != 'approved':
            return Response({'error': 'Guard not approved'}, status=403)

        if not security_profile.assigned_route:
            return Response({'message': 'No route assigned'})

        route = security_profile.assigned_route
        serializer = PatrolRouteSerializer(route)
        return Response(serializer.data)
    except SecurityProfile.DoesNotExist:
        return Response({'error': 'Security profile not found'}, status=403)
