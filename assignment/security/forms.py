# security/forms.py
from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import SecurityProfile

class SecuritySignupForm(UserCreationForm):
    """Form for security personnel registration"""
    first_name = forms.CharField(max_length=30, required=True, widget=forms.TextInput(attrs={'placeholder': 'First Name'}))
    last_name = forms.CharField(max_length=30, required=True, widget=forms.TextInput(attrs={'placeholder': 'Last Name'}))
    email = forms.EmailField(required=True, widget=forms.EmailInput(attrs={'placeholder': 'Email'}))
    phone_number = forms.CharField(max_length=15, required=False, widget=forms.TextInput(attrs={'placeholder': 'Phone Number'}))
    address = forms.CharField(widget=forms.Textarea(attrs={'placeholder': 'Address', 'rows': 3}), required=False)
    date_of_birth = forms.DateField(
        widget=forms.DateInput(attrs={'type': 'date'}),
        required=False
    )

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'password1', 'password2')

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("This email is already registered.")
        return email

    def save(self, commit=True):
        user = super().save(commit=False)
        user.username = self.cleaned_data['email']  # Use email as username
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.email = self.cleaned_data['email']

        if commit:
            user.save()
        return user

class SecurityLoginForm(AuthenticationForm):
    """Form for security personnel login"""
    username = forms.CharField(max_length=254, widget=forms.TextInput(attrs={'placeholder': 'Email'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Password'}))