#!/usr/bin/env python
import os
import django
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'assignment.settings')
django.setup()

from django.test import Client
from django.contrib.auth.models import User
from adminstrator.models import House

# Create test client
client = Client()

# Login as security user
login_success = client.login(username='security1', password='security123')
print(f"Security login successful: {login_success}")

if not login_success:
    print("Failed to login as security user")
    exit(1)

# Get a house QR code to test with
try:
    house = House.objects.get(house_number='H001')
    qr_data = house.qr_code_data
    print(f"Testing with house: {house.house_number} - {house.address}")
    print(f"QR data length: {len(qr_data) if qr_data else 0}")
except House.DoesNotExist:
    print("House H001 not found")
    exit(1)

# Test the scan_qr_code API with comment
test_scan_data = {
    "qr_data": qr_data,
    "comment": "House appears secure, front door locked, no signs of disturbance. All windows closed and locked.",
    "scan_status": "completed",
    "latitude": 40.7128,
    "longitude": -74.0060
}

print("\nTesting scan_qr_code API with comment...")
response = client.post('/security/api/scan-qr/', data=json.dumps(test_scan_data), content_type='application/json')

print(f"Status Code: {response.status_code}")
if response.status_code == 200:
    print("Success! Scan response:")
    print(json.dumps(response.json(), indent=2))
else:
    print(f"Error: {response.content.decode()}")

# Test scanning the same house again (should update)
print("\nTesting update of existing scan...")
test_scan_data['comment'] = "Updated comment: House still secure, added note about backyard gate being slightly ajar but locked."
test_scan_data['scan_status'] = 'issue_found'

response2 = client.post('/security/api/scan-qr/', data=json.dumps(test_scan_data), content_type='application/json')

print(f"Update Status Code: {response2.status_code}")
if response2.status_code == 200:
    print("Success! Update response:")
    print(json.dumps(response2.json(), indent=2))
else:
    print(f"Error: {response2.content.decode()}")

print("\nTest completed!")