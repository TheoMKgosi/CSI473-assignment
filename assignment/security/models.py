from django.db import models
from django.contrib.auth.models import User
from adminstrator.models import House

class PatrolRoute(models.Model):
    """Patrol route model for security guards"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    houses = models.ManyToManyField(House, related_name='patrol_routes')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_routes')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Patrol Route'
        verbose_name_plural = 'Patrol Routes'
        ordering = ['-created_at']

    def __str__(self):
        return self.name

class SecurityProfile(models.Model):
    """Security personnel profile extending Django's User model"""
    STATUS_CHOICES = [
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('suspended', 'Suspended'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='security_profile')
    phone_number = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    employee_id = models.CharField(max_length=20, unique=True)
    role = models.CharField(max_length=20, default='security', editable=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    assigned_route = models.ForeignKey(PatrolRoute, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_guards')
    suspension_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Security Profile'
        verbose_name_plural = 'Security Profiles'

    def __str__(self):
        return f"Security Profile for {self.user}"

    def check_suspension_status(self):
        """Check if guard should be suspended based on compliance"""
        from django.utils import timezone
        from datetime import timedelta
        from adminstrator.models import SecurityCompliance

        # Check last 30 days of compliance
        thirty_days_ago = timezone.now().date() - timedelta(days=30)
        recent_compliance = SecurityCompliance.objects.filter(
            security_guard=self,
            date__gte=thirty_days_ago
        )

        if not recent_compliance.exists():
            return False  # No recent activity, don't suspend

        # Calculate average compliance over last 30 days
        total_score = sum(record.compliance_score for record in recent_compliance)
        avg_compliance = total_score / recent_compliance.count()

        if avg_compliance < 80:
            self.status = 'suspended'
            self.suspension_date = timezone.now()
            self.save()
            return True

        return False
