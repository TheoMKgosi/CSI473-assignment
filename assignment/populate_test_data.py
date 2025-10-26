#!/usr/bin/env python
import os
import django
import sys

# Setup Django
sys.path.append(os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'assignment.settings')
django.setup()

from django.contrib.auth.models import User
from adminstrator.models import House
from members.models import MemberProfile
from security.models import SecurityProfile
import qrcode
import base64
from io import BytesIO

def create_test_data():
    # Create admin user
    admin_user, created = User.objects.get_or_create(
        username='admin',
        defaults={
            'email': 'admin@example.com',
            'first_name': 'Admin',
            'last_name': 'User',
            'is_staff': True,
            'is_superuser': True
        }
    )
    if created:
        admin_user.set_password('admin123')
        admin_user.save()
        print("Created admin user")

    # Create member user
    member_user, created = User.objects.get_or_create(
        username='member1',
        defaults={
            'email': 'member1@example.com',
            'first_name': 'John',
            'last_name': 'Doe'
        }
    )
    if created:
        member_user.set_password('member123')
        member_user.save()
        print("Created member user")

    # Create security user
    security_user, created = User.objects.get_or_create(
        username='security1',
        defaults={
            'email': 'security1@example.com',
            'first_name': 'Jane',
            'last_name': 'Smith'
        }
    )
    if created:
        security_user.set_password('security123')
        security_user.save()
        print("Created security user")

    # Create member profile
    member_profile, created = MemberProfile.objects.get_or_create(
        user=member_user,
        defaults={
            'phone_number': '123-456-7890',
            'address': '456 Oak St',
            'status': 'approved'
        }
    )
    if created:
        print("Created member profile")

    # Create security profile
    security_profile, created = SecurityProfile.objects.get_or_create(
        user=security_user,
        defaults={
            'phone_number': '987-654-3210',
            'address': '789 Pine St',
            'status': 'approved'
        }
    )
    if created:
        print("Created security profile")

    # Create test houses
    houses_data = [
        {
            'address': '123 Main Street',
            'house_number': 'H001',
            'bedrooms': 3,
            'bathrooms': 2,
            'square_footage': 1500,
            'property_type': 'house',
            'is_occupied': True,
            'owner': admin_user
        },
        {
            'address': '456 Elm Avenue',
            'house_number': 'H002',
            'bedrooms': 2,
            'bathrooms': 1,
            'square_footage': 1200,
            'property_type': 'apartment',
            'is_occupied': False,
            'owner': member_user
        },
        {
            'address': '789 Oak Boulevard',
            'house_number': 'H003',
            'bedrooms': 4,
            'bathrooms': 3,
            'square_footage': 2000,
            'property_type': 'house',
            'is_occupied': True,
            'owner': admin_user
        }
    ]

    for house_data in houses_data:
        house, created = House.objects.get_or_create(
            house_number=house_data['house_number'],
            defaults=house_data
        )
        if created or not house.qr_code_data or 'placeholder' in house.qr_code_data:
            # Generate SVG QR code
            try:
                import qrcode
                from qrcode.image.svg import SvgImage
                qr = qrcode.QRCode(
                    version=1,
                    error_correction=qrcode.constants.ERROR_CORRECT_L,
                    box_size=10,
                    border=4,
                )
                qr.add_data(f"http://localhost:8000/adminstrator/house/{house.id}/")
                qr.make(fit=True)

                img = qr.make_image(image_factory=SvgImage)
                svg_data = img.to_string()
                qr_code_base64 = base64.b64encode(svg_data).decode('utf-8')
                house.qr_code_data = f"data:image/svg+xml;base64,{qr_code_base64}"
                house.save()
                print(f"{'Created' if created else 'Updated QR for'} house: {house.house_number} - {house.address}")
            except Exception as e:
                print(f"Failed to generate QR for house {house.house_number}: {e}")
        else:
            print(f"House already exists with QR: {house.house_number} - {house.address}")

    print("Test data creation completed!")

if __name__ == '__main__':
    create_test_data()