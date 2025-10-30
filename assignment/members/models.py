from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    address = models.CharField(max_length=200)
    is_approved = models.BooleanField(default=False)  # Keep for backward compatibility
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True, null=True)
    
    def __str__(self):
        return f"{self.full_name} ({self.user.email})"