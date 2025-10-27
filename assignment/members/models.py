from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

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

class PanicEvent(models.Model):
    """Panic button events triggered by members"""
    member = models.ForeignKey(MemberProfile, on_delete=models.CASCADE, related_name='panic_events')
    timestamp = models.DateTimeField(default=timezone.now)
    location_lat = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    location_lng = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    address = models.TextField(blank=True)
    emergency_type = models.CharField(max_length=50, default='general', choices=[
        ('general', 'General Emergency'),
        ('medical', 'Medical Emergency'),
        ('fire', 'Fire'),
        ('intruder', 'Intruder'),
        ('accident', 'Accident'),
        ('other', 'Other'),
    ])
    description = models.TextField(blank=True)
    resolved = models.BooleanField(default=False)
    resolved_at = models.DateTimeField(null=True, blank=True)
    response_notes = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Panic Event'
        verbose_name_plural = 'Panic Events'
        ordering = ['-timestamp']

    def __str__(self):
        return f"Panic Event by {self.member.user.username} at {self.timestamp}"
