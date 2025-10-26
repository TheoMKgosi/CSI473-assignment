from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .forms import MemberSignupForm, MemberLoginForm

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
