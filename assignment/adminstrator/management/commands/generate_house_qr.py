import qrcode
import os
from io import BytesIO
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.conf import settings
from adminstrator.models import House


class Command(BaseCommand):
    help = 'Generate QR codes for houses that don\'t have them'

    def handle(self, *args, **options):
        houses_without_qr = House.objects.filter(qr_code_data__exact='')

        if not houses_without_qr.exists():
            self.stdout.write(self.style.SUCCESS('All houses already have QR codes!'))
            return

        self.stdout.write(f'Generating QR codes for {houses_without_qr.count()} houses...')

        for house in houses_without_qr:
            # Generate QR code data
            qr_data = f"house:{house.id}"

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
            filename = f'qr_house_{house.id}.png'
            house.qr_code.save(filename, ContentFile(buffer.getvalue()), save=False)
            house.qr_code_data = qr_data
            house.save()

            self.stdout.write(f'Generated QR code for house {house.house_number} - {house.address}')

        self.stdout.write(self.style.SUCCESS(f'Successfully generated QR codes for {houses_without_qr.count()} houses!'))