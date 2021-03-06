from importlib.util import find_spec
from json import loads
from urllib.request import urlopen

from pip._internal import main
from django.core.management import BaseCommand, CommandParser

from apps.core.models import Plugin

ORG = 'reactmed'
REPO = 'neurdicom-plugins'
META = 'META.json'
REPO_URL = 'git+git://github.com/reactmed/neurdicom-plugins.git'


class Command(BaseCommand):
    help = "Uninstall plugins"

    def add_arguments(self, parser: CommandParser):
        parser.add_argument('plugins', nargs='*', type=str)
        parser.add_argument('--all', action='store_true', dest='all',
                            help='Uninstall all plugins')

    def handle(self, *args, **options):
        all_option = True
        if all_option:
            self.stdout.write('Uninstall all plugins')
            for plugin in Plugin.objects.all():
                main(['uninstall', '--yes', plugin.name])
                plugin.delete()
        else:
            for plugin_name in options['plugins']:
                plugin = Plugin.objects.filter(name=plugin_name)
                main(['uninstall', '--yes', plugin.name])
                plugin.delete()
                self.stdout.write('Plugin % is uninstalled' % plugin_name)
        self.stdout.write('Uninstalling plugins completed!')
