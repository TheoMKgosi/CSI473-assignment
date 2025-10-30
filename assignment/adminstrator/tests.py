from django.test import TestCase
from django.contrib.auth.models import User
from django.test import Client
from django.urls import reverse
from security.models import SecurityProfile

class AdministratorSecurityApprovalTest(TestCase):
    def setUp(self):
        # Create admin user
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@test.com',
            password='admin123'
        )

        # Create security user with pending status
        self.security_user = User.objects.create_user(
            username='security@test.com',
            email='security@test.com',
            password='security123',
            first_name='John',
            last_name='Security'
        )
        self.security_profile = SecurityProfile.objects.create(
            user=self.security_user,
            employee_id='SEC001',
            status='pending'
        )

        self.client = Client()

    def test_approve_security_officer(self):
        """Test that an administrator can approve a security officer"""
        # Login as admin
        self.client.login(username='admin', password='admin123')

        # Approve the security officer
        response = self.client.get(reverse('adminstrator:approve_security', args=[self.security_profile.id]))

        # Check redirect to dashboard
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('adminstrator:administrator_dashboard'))

        # Refresh profile from database
        self.security_profile.refresh_from_db()

        # Check status changed to approved
        self.assertEqual(self.security_profile.status, 'approved')

    def test_reject_security_officer(self):
        """Test that an administrator can reject a security officer"""
        # Login as admin
        self.client.login(username='admin', password='admin123')

        # Reject the security officer
        response = self.client.get(reverse('adminstrator:reject_security', args=[self.security_profile.id]))

        # Check redirect to dashboard
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('adminstrator:administrator_dashboard'))

        # Refresh profile from database
        self.security_profile.refresh_from_db()

        # Check status changed to rejected
        self.assertEqual(self.security_profile.status, 'rejected')

    def test_security_login_after_approval(self):
        """Test that approved security officer can login"""
        # First approve the security officer
        self.security_profile.status = 'approved'
        self.security_profile.save()

        # Try to login via API
        response = self.client.post('/security/login/', {
            'email': 'security@test.com',
            'password': 'security123'
        }, content_type='application/json')

        # Should succeed
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('token', data)
        self.assertIn('user', data)

class AdministratorMemberApprovalTest(TestCase):
    def setUp(self):
        # Create admin user
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@test.com',
            password='admin123'
        )

        # Create member user with pending status
        self.member_user = User.objects.create_user(
            username='member@test.com',
            email='member@test.com',
            password='member123',
            first_name='John',
            last_name='Member'
        )
        from members.models import UserProfile
        self.member_profile = UserProfile.objects.create(
            user=self.member_user,
            full_name='John Member',
            phone='1234567890',
            address='123 Test St',
            status='pending'
        )

        self.client = Client()

    def test_approve_member(self):
        """Test that an administrator can approve a member"""
        # Login as admin
        self.client.login(username='admin', password='admin123')

        # Approve the member
        response = self.client.get(reverse('adminstrator:approve_member', args=[self.member_profile.id]))

        # Check redirect to dashboard
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('adminstrator:administrator_dashboard'))

        # Refresh profile from database
        self.member_profile.refresh_from_db()

        # Check status changed to approved
        self.assertEqual(self.member_profile.status, 'approved')
        self.assertTrue(self.member_profile.is_approved)

    def test_reject_member(self):
        """Test that an administrator can reject a member"""
        # Login as admin
        self.client.login(username='admin', password='admin123')

        # Reject the member
        response = self.client.get(reverse('adminstrator:reject_member', args=[self.member_profile.id]))

        # Check redirect to dashboard
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('adminstrator:administrator_dashboard'))

        # Refresh profile from database
        self.member_profile.refresh_from_db()

        # Check status changed to rejected
        self.assertEqual(self.member_profile.status, 'rejected')
        self.assertFalse(self.member_profile.is_approved)
