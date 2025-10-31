import qrcode
import os
from io import BytesIO
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.conf import settings
from members.models import UserProfile


class Command(BaseCommand):
    help = 'Generate QR codes for approved members that don\'t have them'

    def handle(self, *args, **options):
        approved_members_without_qr = UserProfile.objects.filter(
            status='approved',
            qr_code_data__exact=''
        )

        if not approved_members_without_qr.exists():
            self.stdout.write(self.style.SUCCESS('All approved members already have QR codes!'))
            return

        self.stdout.write(f'Generating QR codes for {approved_members_without_qr.count()} approved members...')

        for member in approved_members_without_qr:
            # Generate QR code data
            qr_data = f"member:{member.id}"

            # Create QR code
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            qr.add_data(qr_data)
            qr.make(fit=True)

            # Create QR code image
            img = qr.make_image(fill_color="black", back_color="white")

            # Save to BytesIO
            buffer = BytesIO()
            img.save(buffer, 'PNG')
            buffer.seek(0)

            # Save to model
            filename = f'qr_member_{member.id}.png'
            member.qr_code.save(filename, ContentFile(buffer.getvalue()), save=False)
            member.qr_code_data = qr_data
            member.save()

            self.stdout.write(f'Generated QR code for member {member.full_name} - {member.address}')

        self.stdout.write(self.style.SUCCESS(f'Successfully generated QR codes for {approved_members_without_qr.count()} approved members!'))