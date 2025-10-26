from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from security.models import SecurityProfile

class Command(BaseCommand):
    help = 'Check security guards for suspension based on compliance scores'

    def handle(self, *args, **options):
        self.stdout.write('Checking for guards to suspend...')

        approved_guards = SecurityProfile.objects.filter(status='approved')
        suspended_count = 0

        for guard in approved_guards:
            if guard.check_suspension_status():
                self.stdout.write(
                    self.style.SUCCESS(f'Suspended guard: {guard.user.username}')
                )
                suspended_count += 1

        self.stdout.write(
            self.style.SUCCESS(f'Suspended {suspended_count} guards')
        )