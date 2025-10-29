from django.db import models
from django.contrib.auth.models import User

class SecurityProfile(models.Model):
    """Security personnel profile extending Django's User model"""
    STATUS_CHOICES = [
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='security_profile')
    email = models.EmailField(max_length=254, unique=True)
    phone_number = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    employee_id = models.CharField(max_length=20, unique=True)
    role = models.CharField(max_length=20, default='security', editable=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    class Meta:
        verbose_name = 'Security Profile'
        verbose_name_plural = 'Security Profiles'

    def __str__(self):
        return f"Security Profile for {self.user}"
