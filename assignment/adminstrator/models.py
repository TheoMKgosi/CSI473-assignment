from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class AdministratorProfile(models.Model):
    """Administrator profile extending Django's User model"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='administrator_profile')
    phone_number = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    employee_id = models.CharField(max_length=20, unique=True)
    department = models.CharField(max_length=100, blank=True)
    role = models.CharField(max_length=20, default='administrator', editable=False)

    class Meta:
        verbose_name = 'Administrator Profile'
        verbose_name_plural = 'Administrator Profiles'

    def __str__(self):
        return f"Administrator Profile for {self.user}"

class House(models.Model):
    """House/Property management model"""
    address = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_houses')
    date_registered = models.DateTimeField(default=timezone.now)
    qr_code_data = models.TextField(blank=True, null=True)  # Store QR code data as base64
    house_number = models.CharField(max_length=20, unique=True)
    bedrooms = models.PositiveIntegerField(default=1)
    bathrooms = models.PositiveIntegerField(default=1)
    square_footage = models.PositiveIntegerField()
    property_type = models.CharField(max_length=50, choices=[
        ('apartment', 'Apartment'),
        ('house', 'House'),
        ('condo', 'Condo'),
        ('townhouse', 'Townhouse'),
    ])
    is_occupied = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'House'
        verbose_name_plural = 'Houses'

    def __str__(self):
        return f"{self.house_number} - {self.address}"

class Subscription(models.Model):
    """Subscription management model"""
    SUBSCRIPTION_TYPES = [
        ('basic', 'Basic'),
        ('premium', 'Premium'),
        ('enterprise', 'Enterprise'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('cancelled', 'Cancelled'),
        ('expired', 'Expired'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    house = models.ForeignKey(House, on_delete=models.CASCADE, related_name='subscriptions', null=True, blank=True)
    subscription_type = models.CharField(max_length=20, choices=SUBSCRIPTION_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    start_date = models.DateField()
    end_date = models.DateField()
    monthly_fee = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Subscription'
        verbose_name_plural = 'Subscriptions'

    def __str__(self):
        return f"{self.user.username} - {self.subscription_type} ({self.status})"

class HouseScan(models.Model):
    """Individual house scan records with comments"""
    security_guard = models.ForeignKey('security.SecurityProfile', on_delete=models.CASCADE, related_name='house_scans')
    house = models.ForeignKey(House, on_delete=models.CASCADE, related_name='scan_records')
    compliance_record = models.ForeignKey('SecurityCompliance', on_delete=models.CASCADE, related_name='house_scans')
    scan_time = models.DateTimeField(default=timezone.now)
    comment = models.TextField(blank=True, help_text="Comments about the scan (condition, issues, observations)")
    scan_status = models.CharField(max_length=20, choices=[
        ('completed', 'Completed'),
        ('partial', 'Partial Scan'),
        ('missed', 'Missed'),
        ('issue_found', 'Issue Found'),
    ], default='completed')
    location_lat = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    location_lng = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    class Meta:
        verbose_name = 'House Scan'
        verbose_name_plural = 'House Scans'
        ordering = ['-scan_time']
        unique_together = ['compliance_record', 'house']  # One scan per house per compliance record

    def __str__(self):
        return f"Scan of {self.house} by {self.security_guard.user.username} at {self.scan_time}"

class SecurityCompliance(models.Model):
    """Security guard compliance tracking model"""
    security_guard = models.ForeignKey('security.SecurityProfile', on_delete=models.CASCADE, related_name='compliance_records')
    date = models.DateField()
    shift_start = models.TimeField()
    shift_end = models.TimeField()
    patrols_completed = models.PositiveIntegerField(default=0)
    incidents_reported = models.PositiveIntegerField(default=0)
    tasks_completed = models.PositiveIntegerField(default=0)
    total_tasks_assigned = models.PositiveIntegerField(default=1)
    on_time = models.BooleanField(default=True)
    notes = models.TextField(blank=True)
    scanned_houses = models.ManyToManyField(House, related_name='scanned_records', blank=True)
    route_completed = models.BooleanField(default=False)

    @property
    def compliance_score(self):
        """Calculate compliance score as percentage"""
        if self.total_tasks_assigned == 0:
            return 0
        task_completion = (self.tasks_completed / self.total_tasks_assigned) * 100
        time_bonus = 10 if self.on_time else 0
        patrol_bonus = min(20, self.patrols_completed * 5)

        # Route completion bonus
        route_bonus = 20 if self.route_completed else 0

        return min(100, task_completion + time_bonus + patrol_bonus + route_bonus)

    @property
    def is_compliant(self):
        """Check if compliance meets 80% requirement"""
        return self.compliance_score >= 80

    class Meta:
        verbose_name = 'Security Compliance'
        verbose_name_plural = 'Security Compliance Records'
        ordering = ['-date']

    def __str__(self):
        return f"{self.security_guard.user.username} - {self.date} ({self.compliance_score:.1f}%)"