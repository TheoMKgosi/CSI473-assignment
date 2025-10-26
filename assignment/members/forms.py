from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import MemberProfile

class MemberSignupForm(UserCreationForm):
    """Form for member registration"""
    first_name = forms.CharField(max_length=30, required=True)
    last_name = forms.CharField(max_length=30, required=True)
    email = forms.EmailField(required=True)
    phone_number = forms.CharField(max_length=15, required=False)
    address = forms.CharField(widget=forms.Textarea, required=False)
    date_of_birth = forms.DateField(
        widget=forms.DateInput(attrs={'type': 'date'}),
        required=False
    )

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2')

    def save(self, commit=True):
        user = super().save(commit=False)
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.email = self.cleaned_data['email']

        if commit:
            user.save()
            # Create member profile
            MemberProfile.objects.create(
                user=user,
                phone_number=self.cleaned_data.get('phone_number', ''),
                address=self.cleaned_data.get('address', ''),
                date_of_birth=self.cleaned_data.get('date_of_birth'),
                role='member'
            )
        return user

class MemberLoginForm(AuthenticationForm):
    """Form for member login"""
    username = forms.CharField(max_length=254, widget=forms.TextInput(attrs={'placeholder': 'Username'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Password'}))