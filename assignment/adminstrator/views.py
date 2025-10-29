from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.models import User
from django.db.models import Count, Avg, Sum, Q
from django.utils import timezone
from django.core.paginator import Paginator
from security.models import SecurityProfile
from members.models import UserProfile
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
    pending_members = UserProfile.objects.filter(is_approved=False)
    approved_members = UserProfile.objects.filter(is_approved=True)
    
    context = {
        'pending_security': pending_security,
        'approved_security': approved_security,
        'rejected_security': rejected_security,
        'pending_members': pending_members,
        'approved_members': approved_members,
        'not_members': pending_members,
        'pending_security_count': pending_security.count(),
        'approved_security_count': approved_security.count(),
        'rejected_security_count': rejected_security.count(),
        'pending_members_count': pending_members.count(),
        'approved_members_count': approved_members.count(),
        'not_members_count': pending_members.count(),
    }
    return render(request, 'adminstrator/dashboard.html', context)

@login_required
def approve_security(request, security_id):
    """Approve a security guard application"""
    security_profile = get_object_or_404(SecurityProfile, id=security_id)
    security_profile.status = 'approved'
    security_profile.save()
    messages.success(request, f'Security guard {security_profile.user.get_full_name() or security_profile.user.username} has been approved.')
    return redirect('adminstrator:administrator_dashboard')

@login_required
def reject_security(request, security_id):
    """Reject a security guard application"""
    security_profile = get_object_or_404(SecurityProfile, id=security_id)
    security_profile.status = 'rejected'
    security_profile.save()
    messages.success(request, f'Security guard {security_profile.user.get_full_name() or security_profile.user.username} has been rejected.')
    return redirect('adminstrator:administrator_dashboard')

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
    """Security guard compliance dashboard"""
    # Get all compliance records
    all_compliance = SecurityCompliance.objects.order_by('security_guard', '-date')

    # Filter records with compliance > 80% (using Python property)
    compliant_records = [record for record in all_compliance if record.compliance_score > 80]
    total_guards = all_compliance.count()
    compliant_count = len(compliant_records)
    non_compliant_count = total_guards - compliant_count

    # Overall compliance average (for all records)
    overall_compliance = (
        sum(record.compliance_score for record in all_compliance) / total_guards
        if total_guards > 0 else 0
    )

    # Determine overall compliance class
    if overall_compliance >= 80:
        overall_compliance_class = 'compliance-good'
    elif overall_compliance >= 60:
        overall_compliance_class = 'compliance-warning'
    else:
        overall_compliance_class = 'compliance-danger'

    # Prepare compliance records with additional data (only >80%)
    compliance_records = []
    for record in compliant_records:
        score_class = 'score-high'
        progress_class = 'progress-high'
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

    context = {
        'total_guards': total_guards,
        'compliant_count': compliant_count,
        'non_compliant_count': non_compliant_count,
        'overall_compliance': round(overall_compliance, 1),
        'overall_compliance_class': overall_compliance_class,
        'compliance_records': compliance_records,
    }
    return render(request, 'adminstrator/security_compliance.html', context)

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
    member_profile = get_object_or_404(UserProfile, id=member_id)
    member_profile.is_approved = True
    member_profile.save()
    messages.success(request, f'Member {UserProfile.full_name} has been approved.')
    return redirect('adminstrator:administrator_dashboard')

@login_required
def reject_member(request, member_id):
    """Reject a member application"""
    member_profile = get_object_or_404(UserProfile, id=member_id)
    member_profile.is_approved = 'rejected'
    member_profile.save()
    messages.success(request, f'Member {UserProfile.user.username} has been rejected.')
    return redirect('adminstrator:administrator_dashboard')

@login_required
def print_qr_code(request, user_id):
    """Display QR code for printing"""
    user = get_object_or_404(User, id=user_id)
    try:
        profile = user.userprofile
        if not profile.qr_code:
            messages.error(request, 'No QR code found for this user.')
            return redirect('adminstrator:user_management')
        context = {
            'user': user,
            'profile': profile,
            'qr_code_url': profile.qr_code.url,
        }
        return render(request, 'adminstrator/print_qr.html', context)
    except UserProfile.DoesNotExist:
        messages.error(request, 'User profile not found.')
        return redirect('adminstrator:user_management')

def administrator_logout(request):
    """Handle administrator logout"""
    logout(request)
    messages.info(request, 'You have been logged out.')
    return redirect('adminstrator:administrator_login')
