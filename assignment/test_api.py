#!/usr/bin/env python
import os
import django
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'assignment.settings')
django.setup()

from django.test import Client
from django.contrib.auth.models import User

# Create test client
client = Client()

# Login as admin user
login_success = client.login(username='admin', password='admin123')
print(f"Login successful: {login_success}")

# Test data for creating a new house
test_data = {
    "owner": 2,  # admin user ID
    "address": "999 Test Street",
    "house_number": "H005",
    "bedrooms": 2,
    "bathrooms": 1,
    "square_footage": 1000,
    "property_type": "apartment",
    "is_occupied": False
}

# Test the API
print("Testing house creation API...")
response = client.post('/adminstrator/api/houses/', data=json.dumps(test_data), content_type='application/json')

print(f"Status Code: {response.status_code}")
if response.status_code == 201:
    print("Success! Created house:")
    print(json.dumps(response.json(), indent=2))
else:
    print(f"Error: {response.content.decode()}")

# Also test getting existing houses (but API doesn't support GET)
print("\nChecking existing houses in database...")
from adminstrator.models import House
houses = House.objects.all()
print(f"Total houses in database: {houses.count()}")
for house in houses:
    print(f"- {house.house_number}: {house.address} (Owner: {house.owner.username})")