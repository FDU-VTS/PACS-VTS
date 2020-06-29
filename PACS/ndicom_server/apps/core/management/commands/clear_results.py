from django.core.management import BaseCommand
from apps.core.models import ProcessingResult


class Command(BaseCommand):
    help = "Clear ProcessingResult database"

    def handle(self, *args, **options):
        for Result in ProcessingResult.objects.all():
            Result.result.delete()
            Result.delete()
        self.stdout.write('Completed!')
