# security/models.py
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class SecurityProfile(models.Model):
    """Security personnel profile extending Django's User model"""
    STATUS_CHOICES = [
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='security_profile')
    phone_number = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    employee_id = models.CharField(max_length=20, unique=True)
    role = models.CharField(max_length=20, default='security')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    class Meta:
        verbose_name = 'Security Profile'
        verbose_name_plural = 'Security Profiles'

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.employee_id}"


class ScanLog(models.Model):
    """Log of QR code scans by security guards"""
    security_guard = models.ForeignKey(SecurityProfile, on_delete=models.CASCADE, related_name='scan_logs')
    qr_data = models.TextField()
    comment = models.TextField(blank=True)
    location = models.CharField(max_length=255, blank=True)
    scanned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Scan Log'
        verbose_name_plural = 'Scan Logs'
        ordering = ['-scanned_at']

    def __str__(self):
        return f"Scan by {self.security_guard.user.get_full_name()} at {self.scanned_at}"

