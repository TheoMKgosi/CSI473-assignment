from django.db import models
from django.contrib.auth.models import User

class PanicAlert(models.Model):
    """Model to store panic button alerts from members"""
    member = models.ForeignKey(User, on_delete=models.CASCADE, related_name='panic_alerts')
    timestamp = models.DateTimeField(auto_now_add=True)
    address = models.CharField(max_length=200)  # Store address at time of alert
    status = models.CharField(max_length=20, choices=[
        ('active', 'Active'),
        ('resolved', 'Resolved'),
        ('false_alarm', 'False Alarm'),
    ], default='active')
    resolved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='resolved_alerts')
    resolved_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Panic Alert'
        verbose_name_plural = 'Panic Alerts'
        ordering = ['-timestamp']

    def __str__(self):
        return f"Panic alert by {self.member.get_full_name()} at {self.timestamp}"

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
    qr_code_data = models.TextField(blank=True, help_text="QR code data string for scanning")
    
    def __str__(self):
        return f"{self.full_name} ({self.user.email})"