from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.models import User
from django.db.models import Count, Avg, Sum, Q
from django.utils import timezone
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json
import qrcode
import base64
from io import BytesIO
try:
    from PIL import Image
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False
from security.models import SecurityProfile
from members.models import MemberProfile
from .models import House, Subscription, SecurityCompliance
from .forms import AdministratorSignupForm, AdministratorLoginForm, CreateAdministratorForm

def administrator_signup(request):
    """Handle administrator registration"""
    if request.method == 'POST':
        form = AdministratorSignupForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, 'Administrator account created successfully!')
            return redirect('administrator_dashboard')
    else:
        form = AdministratorSignupForm()
    return render(request, 'adminstrator/signup.html', {'form': form})

def administrator_login(request):
    """Handle administrator login"""
    if request.method == 'POST':
        form = AdministratorLoginForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, f'Welcome back, {username}!')
                return redirect('adminstrator:administrator_dashboard')
            else:
                messages.error(request, 'Invalid username or password.')
        else:
            messages.error(request, 'Invalid username or password.')
    else:
        form = AdministratorLoginForm()
    return render(request, 'adminstrator/login.html', {'form': form})

@login_required
def administrator_dashboard(request):
    """Administrator dashboard view"""
    # Get all security profiles
    pending_security = SecurityProfile.objects.filter(status='pending')
    approved_security = SecurityProfile.objects.filter(status='approved')
    rejected_security = SecurityProfile.objects.filter(status='rejected')
    
    # Get all member profiles
    pending_members = MemberProfile.objects.filter(status='pending')
    approved_members = MemberProfile.objects.filter(status='approved')
    rejected_members = MemberProfile.objects.filter(status='rejected')
    
    context = {
        'pending_security': pending_security,
        'approved_security': approved_security,
        'rejected_security': rejected_security,
        'pending_members': pending_members,
        'approved_members': approved_members,
        'rejected_members': rejected_members,
        'pending_security_count': pending_security.count(),
        'approved_security_count': approved_security.count(),
        'rejected_security_count': rejected_security.count(),
        'pending_members_count': pending_members.count(),
        'approved_members_count': approved_members.count(),
        'rejected_members_count': rejected_members.count(),
    }
    return render(request, 'adminstrator/dashboard.html', context)

@login_required
def approve_security(request, security_id):
    """Approve a security guard application"""
    security_profile = get_object_or_404(SecurityProfile, id=security_id)
    security_profile.status = 'approved'
    security_profile.save()
    messages.success(request, f'Security guard {security_profile.user.username} has been approved.')
    return redirect('adminstrator:administrator_dashboard')

@login_required
def reject_security(request, security_id):
    """Reject a security guard application"""
    security_profile = get_object_or_404(SecurityProfile, id=security_id)
    security_profile.status = 'rejected'
    security_profile.save()
    messages.success(request, f'Security guard {security_profile.user.username} has been rejected.')
    return redirect('adminstrator:administrator_dashboard')

@login_required
def house_management_statistics(request):
    """House management statistics dashboard"""
    houses = House.objects.all()
    
    # Calculate statistics
    total_houses = houses.count()
    occupied_houses = houses.filter(is_occupied=True).count()
    vacant_houses = total_houses - occupied_houses
    occupancy_rate = (occupied_houses / total_houses * 100) if total_houses > 0 else 0
    
    # Property type distribution
    property_types = dict(houses.values('property_type').annotate(count=Count('id')).values_list('property_type', 'count'))
    
    context = {
        'total_houses': total_houses,
        'occupied_houses': occupied_houses,
        'vacant_houses': vacant_houses,
        'occupancy_rate': round(occupancy_rate, 1),
        'property_types': property_types,
        'houses': houses.order_by('-created_at')[:20],  # Recent 20 houses
    }
    return render(request, 'adminstrator/house_management.html', context)

@login_required
def subscription_statistics(request):
    """Subscription statistics dashboard"""
    subscriptions = Subscription.objects.all()
    
    # Calculate statistics
    total_subscriptions = subscriptions.count()
    active_subscriptions = subscriptions.filter(status='active').count()
    
    # Revenue calculations
    monthly_revenue = subscriptions.filter(status='active').aggregate(
        total=Sum('monthly_fee')
    )['total'] or 0
    annual_revenue = monthly_revenue * 12
    
    # Subscription type distribution
    sub_types = subscriptions.values('subscription_type').annotate(
        count=Count('id')
    ).order_by('subscription_type')
    
    subscription_types = {}
    for sub_type in sub_types:
        percentage = (sub_type['count'] / total_subscriptions * 100) if total_subscriptions > 0 else 0
        subscription_types[sub_type['subscription_type']] = {
            'count': sub_type['count'],
            'percentage': round(percentage, 1)
        }
    
    # Status distribution
    subscription_status = dict(subscriptions.values('status').annotate(count=Count('id')).values_list('status', 'count'))
    
    # Recent subscriptions
    recent_subscriptions = subscriptions.order_by('-created_at')[:15]
    
    context = {
        'total_subscriptions': total_subscriptions,
        'active_subscriptions': active_subscriptions,
        'monthly_revenue': monthly_revenue,
        'annual_revenue': annual_revenue,
        'subscription_types': subscription_types,
        'subscription_status': subscription_status,
        'recent_subscriptions': recent_subscriptions,
    }
    return render(request, 'adminstrator/subscription_statistics.html', context)

@login_required
def security_compliance_dashboard(request):
    """Security guard compliance dashboard with integrated route management"""
    # Get latest compliance record for each security guard (SQLite compatible)
    from django.db.models import Max
    latest_dates = SecurityCompliance.objects.values('security_guard').annotate(
        latest_date=Max('date')
    ).values('security_guard', 'latest_date')

    latest_compliance = []
    for item in latest_dates:
        record = SecurityCompliance.objects.filter(
            security_guard=item['security_guard'],
            date=item['latest_date']
        ).first()
        if record:
            latest_compliance.append(record)

    # Calculate statistics
    total_guards = len(latest_compliance)
    compliant_count = sum(1 for record in latest_compliance if record.compliance_score >= 60)
    non_compliant_count = total_guards - compliant_count

    # Overall compliance average
    if latest_compliance:
        overall_compliance = sum(record.compliance_score for record in latest_compliance) / len(latest_compliance)
    else:
        overall_compliance = 0

    # Determine overall compliance class
    if overall_compliance >= 80:
        overall_compliance_class = 'compliance-good'
    elif overall_compliance >= 60:
        overall_compliance_class = 'compliance-warning'
    else:
        overall_compliance_class = 'compliance-danger'

    # Prepare compliance records with additional data
    compliance_records = []
    for record in latest_compliance:
        score_class = 'score-high' if record.compliance_score >= 80 else 'score-medium' if record.compliance_score >= 60 else 'score-low'
        progress_class = 'progress-high' if record.compliance_score >= 80 else 'progress-medium' if record.compliance_score >= 60 else 'progress-low'

        compliance_records.append({
            'security_guard': record.security_guard,
            'date': record.date,
            'compliance_score': record.compliance_score,
            'is_compliant': record.is_compliant,
            'score_class': score_class,
            'progress_class': progress_class,
            'patrols_completed': record.patrols_completed,
            'tasks_completed': record.tasks_completed,
            'total_tasks_assigned': record.total_tasks_assigned,
            'incidents_reported': record.incidents_reported,
            'on_time': record.on_time,
            'notes': record.notes,
        })

    # Sort by compliance score (lowest first for attention)
    compliance_records.sort(key=lambda x: x['compliance_score'])

    # Route management data
    from security.models import PatrolRoute, SecurityProfile

    routes = PatrolRoute.objects.all().prefetch_related('houses', 'assigned_guards')

    # Get route statistics
    total_routes = routes.count()
    assigned_routes = routes.filter(assigned_guards__isnull=False).distinct().count()
    unassigned_routes = total_routes - assigned_routes

    # Get guard assignment stats
    total_guards_route = SecurityProfile.objects.filter(status='approved').count()
    assigned_guards = SecurityProfile.objects.filter(status='approved', assigned_route__isnull=False).count()
    unassigned_guards = total_guards_route - assigned_guards

    # Get available guards for assignment
    available_guards = SecurityProfile.objects.filter(status='approved').select_related('user')

    # Get all houses for route creation/editing
    houses = House.objects.all()

    context = {
        # Compliance data
        'total_guards': total_guards,
        'compliant_count': compliant_count,
        'non_compliant_count': non_compliant_count,
        'overall_compliance': round(overall_compliance, 1),
        'overall_compliance_class': overall_compliance_class,
        'compliance_records': compliance_records,

        # Route management data
        'routes': routes,
        'total_routes': total_routes,
        'assigned_routes': assigned_routes,
        'unassigned_routes': unassigned_routes,
        'total_guards_route': total_guards_route,
        'assigned_guards': assigned_guards,
        'unassigned_guards': unassigned_guards,
        'available_guards': available_guards,
        'houses': houses,
    }
    return render(request, 'adminstrator/security_compliance.html', context)

@login_required
def incidents_dashboard(request):
    """Incidents dashboard showing panic button usage statistics"""
    from members.models import PanicEvent, MemberProfile
    from django.db import models
    from django.db.models.functions import TruncDate

    # Get all panic events
    panic_events = PanicEvent.objects.select_related('member__user').order_by('-timestamp')

    # Calculate statistics
    total_panic_events = panic_events.count()
    resolved_events = panic_events.filter(resolved=True).count()
    unresolved_events = total_panic_events - resolved_events

    # Get unique members who triggered panic buttons
    unique_members = panic_events.values('member').distinct().count()

    # Group panic events by date for trend analysis
    from django.db.models.functions import TruncDate
    panic_by_date = panic_events.annotate(
        date=TruncDate('timestamp')
    ).values('date').annotate(
        count=models.Count('id')
    ).order_by('-date')[:30]  # Last 30 days

    # Get recent panic events (last 10)
    recent_panic_events = panic_events[:10]

    # Prepare panic event details
    panic_details = []
    for event in recent_panic_events:
        panic_details.append({
            'member': event.member,
            'timestamp': event.timestamp,
            'emergency_type': event.emergency_type,
            'location': event.address or 'Location not provided',
            'description': event.description,
            'resolved': event.resolved,
            'resolved_at': event.resolved_at,
        })

    # Get members with most panic button usage
    member_stats = panic_events.values('member__user__username', 'member__user__first_name', 'member__user__last_name').annotate(
        panic_count=models.Count('id'),
        last_panic=models.Max('timestamp')
    ).order_by('-panic_count')[:10]

    context = {
        'total_panic_events': total_panic_events,
        'resolved_events': resolved_events,
        'unresolved_events': unresolved_events,
        'unique_members': unique_members,
        'panic_by_date': list(panic_by_date),
        'recent_panic_events': panic_details,
        'member_stats': list(member_stats),
    }
    return render(request, 'adminstrator/incidents.html', context)

@login_required
def route_management(request):
    """Route management dashboard - list all patrol routes"""
    from security.models import PatrolRoute, SecurityProfile

    routes = PatrolRoute.objects.all().prefetch_related('houses', 'assigned_guards')

    # Get route statistics
    total_routes = routes.count()
    assigned_routes = routes.filter(assigned_guards__isnull=False).distinct().count()
    unassigned_routes = total_routes - assigned_routes

    # Get guard assignment stats
    total_guards = SecurityProfile.objects.filter(status='approved').count()
    assigned_guards = SecurityProfile.objects.filter(status='approved', assigned_route__isnull=False).count()
    unassigned_guards = total_guards - assigned_guards

    context = {
        'routes': routes,
        'total_routes': total_routes,
        'assigned_routes': assigned_routes,
        'unassigned_routes': unassigned_routes,
        'total_guards': total_guards,
        'assigned_guards': assigned_guards,
        'unassigned_guards': unassigned_guards,
    }
    return render(request, 'adminstrator/route_management.html', context)

@login_required
def create_route(request):
    """Create a new patrol route"""
    from security.models import PatrolRoute
    from adminstrator.models import House

    if request.method == 'POST':
        name = request.POST.get('name')
        description = request.POST.get('description')
        house_ids = request.POST.getlist('houses')

        if name:
            route = PatrolRoute.objects.create(
                name=name,
                description=description,
                created_by=request.user
            )
            if house_ids:
                houses = House.objects.filter(id__in=house_ids)
                route.houses.set(houses)
            messages.success(request, f'Route "{name}" created successfully!')
            return redirect('adminstrator:route_management')
        else:
            messages.error(request, 'Route name is required.')

    houses = House.objects.all()
    return render(request, 'adminstrator/create_route.html', {'houses': houses})

@login_required
def edit_route(request, route_id):
    """Edit an existing patrol route"""
    from security.models import PatrolRoute
    from adminstrator.models import House

    try:
        route = PatrolRoute.objects.get(id=route_id)
    except PatrolRoute.DoesNotExist:
        messages.error(request, 'Route not found.')
        return redirect('adminstrator:route_management')

    if request.method == 'POST':
        name = request.POST.get('name')
        description = request.POST.get('description')
        house_ids = request.POST.getlist('houses')

        if name:
            route.name = name
            route.description = description
            route.save()
            if house_ids:
                houses = House.objects.filter(id__in=house_ids)
                route.houses.set(houses)
            else:
                route.houses.clear()
            messages.success(request, f'Route "{name}" updated successfully!')
            return redirect('adminstrator:route_management')
        else:
            messages.error(request, 'Route name is required.')

    houses = House.objects.all()
    selected_houses = route.houses.values_list('id', flat=True)
    return render(request, 'adminstrator/edit_route.html', {
        'route': route,
        'houses': houses,
        'selected_houses': selected_houses
    })

@login_required
def delete_route(request, route_id):
    """Delete a patrol route"""
    from security.models import PatrolRoute

    try:
        route = PatrolRoute.objects.get(id=route_id)
        route_name = route.name
        route.delete()
        messages.success(request, f'Route "{route_name}" deleted successfully!')
    except PatrolRoute.DoesNotExist:
        messages.error(request, 'Route not found.')

    return redirect('adminstrator:route_management')

@login_required
def assign_guard_to_route(request, route_id):
    """Assign a guard to a route"""
    from security.models import PatrolRoute, SecurityProfile

    try:
        route = PatrolRoute.objects.get(id=route_id)
    except PatrolRoute.DoesNotExist:
        messages.error(request, 'Route not found.')
        return redirect('adminstrator:route_management')

    if request.method == 'POST':
        guard_id = request.POST.get('guard_id')
        if guard_id:
            try:
                guard = SecurityProfile.objects.get(id=guard_id, status='approved')
                # Unassign from current route if any
                SecurityProfile.objects.filter(assigned_route=route).update(assigned_route=None)
                # Assign to new route
                guard.assigned_route = route
                guard.save()
                messages.success(request, f'Guard {guard.user.username} assigned to route "{route.name}"!')
            except SecurityProfile.DoesNotExist:
                messages.error(request, 'Guard not found or not approved.')
        else:
            messages.error(request, 'Please select a guard.')

    # Get available guards (approved and not assigned to this route)
    available_guards = SecurityProfile.objects.filter(
        status='approved'
    ).exclude(assigned_route=route).select_related('user')

    assigned_guards = SecurityProfile.objects.filter(
        assigned_route=route
    ).select_related('user')

    return render(request, 'adminstrator/assign_guard.html', {
        'route': route,
        'available_guards': available_guards,
        'assigned_guards': assigned_guards,
    })

@login_required
def unassign_guard_from_route(request, guard_id):
    """Unassign a guard from their route"""
    from security.models import SecurityProfile

    try:
        guard = SecurityProfile.objects.get(id=guard_id)
        route_name = guard.assigned_route.name if guard.assigned_route else 'route'
        guard.assigned_route = None
        guard.save()
        messages.success(request, f'Guard {guard.user.username} unassigned from {route_name}!')
    except SecurityProfile.DoesNotExist:
        messages.error(request, 'Guard not found.')

    return redirect('adminstrator:route_management')

@login_required
def user_management(request):
    """User management dashboard with filtering and search"""
    users = User.objects.all()
    
    # Apply filters
    search_query = request.GET.get('search', '')
    role_filter = request.GET.get('role', '')
    status_filter = request.GET.get('status', '')
    
    if search_query:
        users = users.filter(
            Q(username__icontains=search_query) |
            Q(email__icontains=search_query) |
            Q(first_name__icontains=search_query) |
            Q(last_name__icontains=search_query)
        )
    
    if role_filter:
        if role_filter == 'administrator':
            users = users.filter(Q(is_superuser=True) | Q(administrator_profile__isnull=False))
        elif role_filter == 'security':
            users = users.filter(security_profile__isnull=False)
        elif role_filter == 'member':
            users = users.filter(
                Q(is_superuser=False) &
                Q(administrator_profile__isnull=True) &
                Q(security_profile__isnull=True)
            )
    
    if status_filter:
        if status_filter == 'active':
            users = users.filter(is_active=True)
        elif status_filter == 'inactive':
            users = users.filter(is_active=False)
    
    # Order by most recent join date
    users = users.order_by('-date_joined')
    
    # Pagination
    paginator = Paginator(users, 20)  # 20 users per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Calculate statistics
    total_users = User.objects.count()
    active_users = User.objects.filter(is_active=True).count()
    admin_count = User.objects.filter(Q(is_superuser=True) | Q(administrator_profile__isnull=False)).count()
    security_count = User.objects.filter(security_profile__isnull=False).count()
    member_count = User.objects.filter(
        Q(is_superuser=False) &
        Q(administrator_profile__isnull=True) &
        Q(security_profile__isnull=True)
    ).count()
    
    context = {
        'users': page_obj,
        'is_paginated': page_obj.has_other_pages(),
        'page_obj': page_obj,
        'total_users': total_users,
        'active_users': active_users,
        'admin_count': admin_count,
        'security_count': security_count,
        'member_count': member_count,
    }
    return render(request, 'adminstrator/user_management.html', context)

@login_required
def activate_user(request, user_id):
    """Activate a user account"""
    user = get_object_or_404(User, id=user_id)
    if user.is_superuser:
        messages.error(request, 'Cannot modify superuser accounts.')
    else:
        user.is_active = True
        user.save()
        messages.success(request, f'User {user.username} has been activated.')
    return redirect('adminstrator:user_management')

@login_required
def deactivate_user(request, user_id):
    """Deactivate a user account"""
    user = get_object_or_404(User, id=user_id)
    if user.is_superuser:
        messages.error(request, 'Cannot modify superuser accounts.')
    elif user == request.user:
        messages.error(request, 'Cannot deactivate your own account.')
    else:
        user.is_active = False
        user.save()
        messages.success(request, f'User {user.username} has been deactivated.')
    return redirect('adminstrator:user_management')

@login_required
def delete_user(request, user_id):
    """Delete a user account"""
    user = get_object_or_404(User, id=user_id)
    if user.is_superuser:
        messages.error(request, 'Cannot delete superuser accounts.')
    elif user == request.user:
        messages.error(request, 'Cannot delete your own account.')
    else:
        username = user.username
        user.delete()
        messages.success(request, f'User {username} has been deleted.')
    return redirect('adminstrator:user_management')

@login_required
def create_administrator(request):
    """Create new administrator account"""
    if request.method == 'POST':
        form = CreateAdministratorForm(request.POST)
        if form.is_valid():
            user = form.save()
            messages.success(request, f'Administrator {user.username} has been created successfully.')
            return redirect('adminstrator:user_management')
    else:
        form = CreateAdministratorForm()
    return render(request, 'adminstrator/create_admin.html', {'form': form})

@login_required
def approve_member(request, member_id):
    """Approve a member application"""
    member_profile = get_object_or_404(MemberProfile, id=member_id)
    member_profile.status = 'approved'
    member_profile.save()
    messages.success(request, f'Member {member_profile.user.username} has been approved.')
    return redirect('adminstrator:administrator_dashboard')

@login_required
def reject_member(request, member_id):
    """Reject a member application"""
    member_profile = get_object_or_404(MemberProfile, id=member_id)
    member_profile.status = 'rejected'
    member_profile.save()
    messages.success(request, f'Member {member_profile.user.username} has been rejected.')
    return redirect('adminstrator:administrator_dashboard')

def administrator_logout(request):
    """Handle administrator logout"""
    logout(request)
    messages.info(request, 'You have been logged out.')
    return redirect('adminstrator:administrator_login')

@login_required
def house_detail(request, house_id):
    """Display house details"""
    house = get_object_or_404(House, id=house_id)
    return render(request, 'adminstrator/house_detail.html', {'house': house})

@csrf_exempt
@require_POST
@login_required
def house_create_api(request):
    try:
        data = json.loads(request.body)
        owner_id = data.get('owner')
        address = data.get('address')
        house_number = data.get('house_number')
        bedrooms = data.get('bedrooms', 1)
        bathrooms = data.get('bathrooms', 1)
        square_footage = data.get('square_footage')
        property_type = data.get('property_type', 'house')
        is_occupied = data.get('is_occupied', True)

        owner = User.objects.get(id=owner_id)
        house = House.objects.create(
            owner=owner,
            address=address,
            house_number=house_number,
            bedrooms=bedrooms,
            bathrooms=bathrooms,
            square_footage=square_footage,
            property_type=property_type,
            is_occupied=is_occupied,
        )

        # Generate QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(f"http://localhost:8000/adminstrator/house/{house.id}/")
        qr.make(fit=True)

        # Generate SVG QR code (doesn't require PIL)
        try:
            from qrcode.image.svg import SvgImage
            img = qr.make_image(image_factory=SvgImage)
            svg_data = img.to_string()
            qr_code_base64 = base64.b64encode(svg_data).decode('utf-8')
            house.qr_code_data = f"data:image/svg+xml;base64,{qr_code_base64}"
        except Exception as e:
            # Fallback: try PNG with PIL if available
            try:
                img = qr.make_image(fill='black', back_color='white')
                buffer = BytesIO()
                img.save(buffer, format='PNG')
                buffer.seek(0)
                qr_code_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
                house.qr_code_data = f"data:image/png;base64,{qr_code_base64}"
            except Exception as e2:
                # Last fallback: store the URL as plain text
                house.qr_code_data = f"http://localhost:8000/adminstrator/house/{house.id}/"
        house.save()

        return JsonResponse({
            'id': house.id,
            'address': house.address,
            'owner': house.owner.username,
            'date_registered': house.date_registered.isoformat(),
            'qr_code_data': house.qr_code_data,
        }, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
