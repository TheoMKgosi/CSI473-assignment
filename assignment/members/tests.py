from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from .models import UserProfile

class MemberAPITestCase(APITestCase):
    def test_signup_success(self):
        data = {
            'email': 'test@example.com',
            'password': 'testpass123',
            'full_name': 'Test User',
            'phone': '1234567890',
            'address': '123 Test St'
        }
        response = self.client.post('/members/signup/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertTrue(User.objects.filter(email='test@example.com').exists())
        user = User.objects.get(email='test@example.com')
        self.assertTrue(UserProfile.objects.filter(user=user).exists())

    def test_signup_duplicate_email(self):
        User.objects.create_user(username='test@example.com', email='test@example.com', password='pass')
        data = {
            'email': 'test@example.com',
            'password': 'testpass123',
            'full_name': 'Test User',
            'phone': '1234567890',
            'address': '123 Test St'
        }
        response = self.client.post('/members/signup/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('errors', response.data)

    def test_login_unapproved(self):
        user = User.objects.create_user(username='test@example.com', email='test@example.com', password='testpass123')
        UserProfile.objects.create(user=user, full_name='Test User', phone='1234567890', address='123 Test St', is_approved=False)
        data = {'email': 'test@example.com', 'password': 'testpass123'}
        response = self.client.post('/members/login/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('errors', response.data)

    def test_login_success(self):
        user = User.objects.create_user(username='test@example.com', email='test@example.com', password='testpass123')
        UserProfile.objects.create(user=user, full_name='Test User', phone='1234567890', address='123 Test St', is_approved=True)
        data = {'email': 'test@example.com', 'password': 'testpass123'}
        response = self.client.post('/members/login/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertIn('token', response.data)
