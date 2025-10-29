from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from .models import SecurityProfile

class SecurityAuthTests(APITestCase):
    def test_security_signup(self):
        """Test security officer signup"""
        data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@example.com',
            'password': 'password123'
        }

        response = self.client.post('/security/signup/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('success', response.data)
        self.assertTrue(response.data['success'])

        # Check user was created
        user = User.objects.get(email='john.doe@example.com')
        self.assertEqual(user.first_name, 'John')
        self.assertEqual(user.last_name, 'Doe')

        # Check profile was created
        profile = SecurityProfile.objects.get(user=user)
        self.assertEqual(profile.status, 'pending')
        self.assertTrue(profile.employee_id.startswith('SEC'))

    def test_security_login_pending(self):
        """Test login with pending status"""
        # Create user and profile
        user = User.objects.create_user(
            username='test@example.com',
            email='test@example.com',
            password='password123',
            first_name='Test',
            last_name='User'
        )
        SecurityProfile.objects.create(
            user=user,
            employee_id='SEC123456',
            status='pending'
        )

        data = {
            'email': 'test@example.com',
            'password': 'password123'
        }

        response = self.client.post('/security/login/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('pending', response.data['error'])

    def test_security_login_approved(self):
        """Test login with approved status"""
        # Create user and profile
        user = User.objects.create_user(
            username='approved@example.com',
            email='approved@example.com',
            password='password123',
            first_name='Approved',
            last_name='User'
        )
        SecurityProfile.objects.create(
            user=user,
            employee_id='SEC654321',
            status='approved'
        )

        data = {
            'email': 'approved@example.com',
            'password': 'password123'
        }

        response = self.client.post('/security/login/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertIn('user', response.data)