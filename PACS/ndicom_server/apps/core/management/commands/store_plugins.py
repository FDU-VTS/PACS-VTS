import os
import zipfile
import tarfile as tar
from django.core.management import BaseCommand, CommandParser
from json import loads
from apps.core.models import Plugin
from pip._internal import main
from importlib.util import find_spec


class Command(BaseCommand):
    help = "Install plugins"

    def _store(self, name, upgrade=False):
        if not os.path.exists(name):
            return
        if os.path.isfile(name) and name.endswith('.tar.gz') and tar.is_tarfile(name):
            meta_path = os.path.join(os.path.dirname(name), 'META.json')
            print(meta_path)
            meta = open(meta_path)
            plugin = Plugin()
            plugin_meta = loads(meta.read())
            plugin.name = plugin_meta['name']
            plugin.display_name = plugin_meta['display_name']
            plugin.author = plugin_meta['author']
            plugin.version = plugin_meta['version']
            plugin.result = plugin_meta['result']
            plugin.is_installed = True
            plugin.save()
            if upgrade:
                main(['install', '--upgrade', name])
            else:
                main(['install', name])
            if find_spec(plugin.name) is None:
                raise ModuleNotFoundError('%s was not installed!' % plugin)
            self.stdout.write('=> %s installed' % plugin.name)
        if os.path.isdir(name):
            files = [os.path.join(name, f) for f in os.listdir(name)]
            for f in files:
                self._store(f)

    def add_arguments(self, parser: CommandParser):
        parser.add_argument('locations', nargs='+', type=str)
        parser.add_argument('--clear', action='store_true', dest='clear',
                            help='Clear database')
        parser.add_argument('--native', action='store_true', dest='native',
                            help='Store plugins as native')

    def handle(self, *args, **options):
        if options.get('clear', False):
            self.stdout.write('Clear')
            for plugin in Plugin.objects.all():
                plugin.plugin.delete()
                plugin.delete()
        for name in options['locations']:
            self._store(name)
        self.stdout.write('Completed!')
