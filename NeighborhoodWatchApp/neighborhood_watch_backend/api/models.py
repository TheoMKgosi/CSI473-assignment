from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    address = models.CharField(max_length=200)
    is_approved = models.BooleanField(default=False)
    subscription_active = models.BooleanField(default=True)
    last_payment_date = models.DateField(null=True, blank=True)

class ForumPost(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0)

class PatrolStat(models.Model):
    completed = models.IntegerField(default=0)
    response_time = models.CharField(max_length=50, default='0 min')
    updated_at = models.DateTimeField(auto_now=True)

class EmergencyAlert(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    location = models.CharField(max_length=200, blank=True)