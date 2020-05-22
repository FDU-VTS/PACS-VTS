#!/usr/bin/env python
import logging
import signal

from tornado.httpclient import AsyncHTTPClient

logging.basicConfig(format='%(levelname)s: %(asctime)s - %(message)s', datefmt='%d.%m.%Y %I:%M:%S')

import django
import sys
from pydicom.uid import *
from pynetdicom import *

os.environ['DJANGO_SETTINGS_MODULE'] = 'neurdicom.settings'
django.setup()
from neurdicom.urls import *
import neurdicom.settings as settings
from tornado.options import options, define, parse_command_line
from apps.dicom_ws.handlers import *
from apps.users.handlers import *
import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.wsgi
define('aet', type=str, default='NEURDICOM')
define('rest_port', type=int, default=8080)
define('dicom_port', type=int, default=4242)


def main():
    parse_command_line()

    rest_app = tornado.web.Application(
        [
            # Patients
            (PATIENT_STUDIES_URL, PatientStudiesHandler),
            (PATIENT_DETAIL_URL, PatientDetailHandler),
            (PATIENT_LIST_URL, PatientListHandler),

            # Studies
            (STUDY_SERIES_URL, StudySeriesHandler),
            (STUDY_DETAIL_URL, StudyDetailHandler),
            (STUDY_LIST_URL, StudyListHandler),

            # Series
            (SERIES_INSTANCES_URL, SeriesInstancesHandler),
            (SERIES_DETAIL_URL, SeriesDetailHandler),
            (SERIES_LIST_URL, SeriesListHandler),

            # Instances
            (INSTANCE_PROCESS_URL, InstanceProcessHandler),
            (INSTANCE_TAGS_URL, InstanceTagsHandler),
            (INSTANCE_IMAGE_URL, InstanceImageHandler),
            (INSTANCE_RAW_URL, InstanceRawHandler),
            (INSTANCE_DETAIL_URL, InstanceDetailHandler),
            (INSTANCE_LIST_URL, InstanceListHandler),
            (INSTANCE_UPLOAD_URL, InstanceUploadHandler),

            # Plugins
            (PLUGIN_DETAIL_URL, PluginDetailHandler),
            (PLUGIN_LIST_URL, PluginListHandler),
            (PLUGIN_INSTALL_URL, InstallPluginHandler),

            # Media download
            (MEDIA_URL, tornado.web.StaticFileHandler, {'path': 'media'})
        ], cookie_secret=settings.SECRET_KEY)
    rest_port = options.rest_port or settings.DICOMWEB_SERVER['port']
    if settings.RUN_DICOM:
        new_pid = os.fork()
        if new_pid == 0:
            try:
                logging.info('DICOM server starting at port = %d' % settings.DICOM_SERVER['port'])
                dicom_server = DICOMServer(ae_title=settings.DICOM_SERVER['aet'], port=settings.DICOM_SERVER['port'],
                                           scp_sop_class=StorageSOPClassList + [VerificationSOPClass],
                                           transfer_syntax=UncompressedPixelTransferSyntaxes)
                dicom_server.start()
            except (KeyboardInterrupt, SystemExit):
                logging.info('DICOM server finishing...')
                logging.info('Child process exiting...')
                sys.exit(0)
        elif new_pid > 0:
            try:
                rest_server = tornado.httpserver.HTTPServer(rest_app)
                rest_server.bind(rest_port)
                rest_server.start()
                logging.info('Rest server starting at port = %d' % settings.DICOMWEB_SERVER['port'])
                tornado.ioloop.IOLoop.current().start()
            except (KeyboardInterrupt, SystemExit):
                logging.info('Rest server finishing...')
                os.kill(new_pid, signal.SIGINT)
                logging.info('Parent process exiting...')
                sys.exit(0)
        else:
            logging.error('Can not fork any processes')
    else:
        try:
            rest_server = tornado.httpserver.HTTPServer(rest_app)
            rest_server.bind(rest_port)
            rest_server.start()
            logging.info('Rest server starting at port = %d' % rest_port)
            tornado.ioloop.IOLoop.current().start()
        except (KeyboardInterrupt, SystemExit):
            logging.info('Rest server finishing...')
            logging.info('Parent process exiting...')
            sys.exit(0)


if __name__ == '__main__':
    main()
