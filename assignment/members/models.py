from django.db import models
from django.contrib.auth.models import User

class MemberProfile(models.Model):
    """Member profile extending Django's User model"""
    STATUS_CHOICES = [
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='member_profile')
    phone_number = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    role = models.CharField(max_length=20, default='member', editable=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    class Meta:
        verbose_name = 'Member Profile'
        verbose_name_plural = 'Member Profiles'

    def __str__(self):
        return f"Member Profile for {self.user}"
