from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .forms import SecuritySignupForm, SecurityLoginForm

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
