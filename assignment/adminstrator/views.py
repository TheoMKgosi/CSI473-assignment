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
    pending_members = UserProfile.objects.filter(status='pending')
    approved_members = UserProfile.objects.filter(status='approved')
    rejected_members = UserProfile.objects.filter(status='rejected')
    
    context = {
        'pending_security': pending_security,
        'approved_security': approved_security,
        'rejected_security': rejected_security,
        'pending_members': pending_members,
        'approved_members': approved_members,
        'rejected_members': rejected_members,
        'not_members': pending_members,
        'pending_security_count': pending_security.count(),
        'approved_security_count': approved_security.count(),
        'rejected_security_count': rejected_security.count(),
        'pending_members_count': pending_members.count(),
        'approved_members_count': approved_members.count(),
        'rejected_members_count': rejected_members.count(),
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
    # Get all security guards
    all_guards = SecurityProfile.objects.filter(status='approved')

    # Get latest compliance record for each guard
    compliance_records = []
    compliant_count = 0
    total_compliance_scores = []

    for guard in all_guards:
        latest_record = SecurityCompliance.objects.filter(security_guard=guard).order_by('-date').first()
        if latest_record:
            compliance_score = latest_record.compliance_score
            total_compliance_scores.append(compliance_score)
            is_compliant = compliance_score >= 80
            if is_compliant:
                compliant_count += 1

            # Determine score and progress classes
            if compliance_score >= 80:
                score_class = 'score-high'
                progress_class = 'progress-high'
            elif compliance_score >= 60:
                score_class = 'score-medium'
                progress_class = 'progress-medium'
            else:
                score_class = 'score-low'
                progress_class = 'progress-low'

            compliance_records.append({
                'security_guard': guard,
                'date': latest_record.date,
                'compliance_score': compliance_score,
                'is_compliant': is_compliant,
                'score_class': score_class,
                'progress_class': progress_class,
                'patrols_completed': latest_record.patrols_completed,
                'tasks_completed': latest_record.tasks_completed,
                'total_tasks_assigned': latest_record.total_tasks_assigned,
                'incidents_reported': latest_record.incidents_reported,
                'on_time': latest_record.on_time,
                'notes': latest_record.notes,
            })

    total_guards = len(all_guards)
    non_compliant_count = total_guards - compliant_count

    # Overall compliance average
    overall_compliance = (
        sum(total_compliance_scores) / len(total_compliance_scores)
        if total_compliance_scores else 0
    )

    # Determine overall compliance class
    if overall_compliance >= 80:
        overall_compliance_class = 'compliance-good'
    elif overall_compliance >= 60:
        overall_compliance_class = 'compliance-warning'
    else:
        overall_compliance_class = 'compliance-danger'

    # Sort by compliance score (lowest first for attention)
    compliance_records.sort(key=lambda x: x['compliance_score'])

    # Get scanned QR codes (QR codes of security guards)
    scanned_qr_codes = []
    for guard in all_guards:
        try:
            profile = guard.user.userprofile
            if profile.qr_code:
                scanned_qr_codes.append({
                    'image': profile.qr_code,
                    'user': guard.user,
                })
        except UserProfile.DoesNotExist:
            pass

    context = {
        'total_guards': total_guards,
        'compliant_count': compliant_count,
        'non_compliant_count': non_compliant_count,
        'overall_compliance': round(overall_compliance, 1),
        'overall_compliance_class': overall_compliance_class,
        'compliance_records': compliance_records,
        'scanned_qr_codes': scanned_qr_codes,
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
    member_profile.status = 'approved'
    member_profile.is_approved = True  # Keep for backward compatibility
    member_profile.save()
    messages.success(request, f'Member {member_profile.full_name} has been approved.')
    return redirect('adminstrator:administrator_dashboard')

@login_required
def reject_member(request, member_id):
    """Reject a member application"""
    member_profile = get_object_or_404(UserProfile, id=member_id)
    member_profile.status = 'rejected'
    member_profile.is_approved = False  # Keep for backward compatibility
    member_profile.save()
    messages.success(request, f'Member {member_profile.user.get_full_name() or member_profile.user.username} has been rejected.')
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
