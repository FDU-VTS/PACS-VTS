import pynetdicom as netdicom
from pydicom.uid import *
from pydicom import read_file, FileDataset
from tornado import gen
from tornado.httpclient import AsyncHTTPClient
from tornado.web import asynchronous

from apps.core.handlers import *
from apps.core.utils import *
from apps.dicom_ws.serializers import *
import pip
import os

ECHO_SUCCESS = 0x0000
REPO_URL = 'git+git://github.com/reactmed/neurdicom-plugins.git'


# GET /api/patients
@required_auth(methods=['GET'])
class PatientListHandler(ListHandler):
    """
    Return all patients stored in database

    Success

    - 200 - All patients were found

    Failure

    - 401 - Not authorized user
    - 403 - User has not permissions for retrieving patients

    """
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer


# GET /api/patients/:id
@required_auth(methods=['GET', 'DELETE'])
class PatientDetailHandler(RetrieveDestroyHandler):
    """
    Return patient by specified id

    Success

    - 200 - Found patient

    Failure

    - 404 - Patient not found with specified id
    - 401 - Not authorized user
    - 403 - User has not permissions for retrieving patients

    """
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer


# GET /api/patients/:id/studies
@required_auth(methods=['GET'])
class PatientStudiesHandler(ListHandler):
    """ Get patient's studies

    Success

    - 200 - All studies were found

    Failure

    - 404 - Patient not found with specified id
    - 401 - Not authorized user
    - 403 - User has not permissions for retrieving patients

    """
    expected_path_params = ['patient_id']
    serializer_class = StudySerializer

    @property
    def queryset(self):
        return Study.objects.filter(patient_id=self.path_params['patient_id'])


# GET /api/studies
@required_auth(methods=['GET'])
class StudyListHandler(ListHandler):
    """ Get studies

    Success

    - 200 - All studies were found

    Failure

    - 401 - Not authorized user
    - 403 - User has not permissions for retrieving patients

    """
    queryset = Study.objects.all()
    serializer_class = StudySerializer


# GET /api/studies/:id
@required_auth(methods=['GET', 'DELETE'])
class StudyDetailHandler(RetrieveDestroyHandler):
    """ Find study by id

    Success

       - 200 - Study found

    Failure

       - 404 - Not found
       - 401 - Not authorized user
       - 403 - User has not permissions for retrieving patients
    """
    queryset = Study.objects.all()
    serializer_class = StudySerializer


# GET /api/studies/:id/series
@required_auth(methods=['GET'])
class StudySeriesHandler(ListHandler):
    """ Find series by study

    Success

       - 200 - All series were found

    Failure

       - 401 - Not authorized user
       - 403 - User has not permissions for retrieving patients
    """
    expected_path_params = ['study_id']
    serializer_class = SeriesSerializer

    @property
    def queryset(self):
        return Series.objects.filter(study_id=self.path_params['study_id'])


# GET /api/series
@required_auth(methods=['GET'])
class SeriesListHandler(ListHandler):
    """ Find series

    Success

        - 200 - All series were found

    Failure

        - 401 - Not authorized user
        - 403 - User has not permissions for retrieving patients
    """
    queryset = Series.objects.all()
    serializer_class = SeriesSerializer


# GET /api/series/:id
@required_auth(methods=['GET', 'DELETE'])
class SeriesDetailHandler(RetrieveDestroyHandler):
    """ Find series by id

    Success

        - 200 - Series was found

    Failure

        - 404 - Series not found
        - 401 - Not authorized user
        - 403 - User has not permissions for retrieving patients
    """
    queryset = Series.objects.all()
    serializer_class = SeriesSerializer


# GET /api/series/:id/instances
@required_auth(methods=['GET'])
class SeriesInstancesHandler(ListHandler):
    """ Find instances by series

    Success

        - 200 - All instances were found

    Failure

        - 401 - Not authorized user
        - 403 - User has not permissions for retrieving patients
    """
    expected_path_params = ['series_id']
    serializer_class = InstanceDetailSerializer

    @property
    def queryset(self):
        return Instance.objects.filter(series_id=self.path_params['series_id']).order_by('instance_number')


# GET /api/instances
@required_auth(methods=['GET'])
class InstanceListHandler(ListHandler):
    """ Find instances

    Success

        - 200 - All instances were found

    Failure

        - 401 - Not authorized user
        - 403 - User has not permissions for retrieving patients
    """
    queryset = Instance.objects.all()
    serializer_class = InstanceSerializer


@required_auth(methods=['POST'])
class InstanceUploadHandler(BaseNeurDicomHandler):
    def post(self, *args, **kwargs):
        for name in self.request.files:
            DicomSaver.save(BytesIO(self.request.files[name][0]['body']))


# GET /api/instances/:id
@required_auth(methods=['GET', 'DELETE'])
class InstanceDetailHandler(RetrieveDestroyHandler):
    """ Find instance by id

    Success

        - 200 - Instance was found

    Failure
        - 404 - Instance not found
        - 401 - Not authorized user
        - 403 - User has not permissions for retrieving patients
    """
    queryset = Instance.objects.all()
    serializer_class = InstanceDetailSerializer


# POST /api/instances/:id/process/by_plugin/:id/json
@required_auth(methods=['POST'])
class InstanceJsonProcessHandler(BaseJsonHandler):
    """ Process an instances with specified plugin (or filter)

    Success

        - 200 - OK

    Failure
        - 404 - Instance or plugin were not found
        - 500 - Process error
        - 401 - Not authorized user
        - 403 - User has not permissions for retrieving patients
    """
    @gen.coroutine
    def post(self, instance_id, by_plugin_id, *args, **kwargs):
        instance = Instance.objects.get(pk=instance_id)
        plugin = Plugin.objects.get(pk=by_plugin_id)
        params = self.request.arguments
        with ImageProcessor(plugin) as processor:
            result = processor.process(instance, **params)
        res_name = str(plugin.name)+str(instance_id)
        if plugin.result['type'] == 'JSON':
            if isinstance(result, dict):
                result = json.dumps(result)
            yield self.write(self, result)
        else:
            yield self.send_error(500, message='result type is not Json')


# POST /api/instances/:id/process/by_plugin/:id/image
@required_auth(methods=['POST'])
class InstanceImgProcessHandler(BaseDicomImageHandler):
    """ Process an instances with specified plugin (or filter)

    Success

        - 200 - OK

    Failure
        - 404 - Instance or plugin were not found
        - 500 - Process error
        - 401 - Not authorized user
        - 403 - User has not permissions for retrieving patients
    """
    @gen.coroutine
    def post(self, instance_id, by_plugin_id, *args, **kwargs):
        instance = Instance.objects.get(pk=instance_id)
        plugin = Plugin.objects.get(pk=by_plugin_id)
        params = self.request.arguments
        with ImageProcessor(plugin) as processor:
            result = processor.process(instance, **params)
        res_name = str(plugin.name)+str(instance_id)
        if plugin.result['type'] == 'IMAGE':
            print(res_name)
            result = convert_array_to_img(result, res_name)
            yield self.write(result)
        else:
            yield self.send_error(500, message='result type is not image')


# GET /api/instances/:id/tags
@required_auth(methods=['GET'])
class InstanceTagsHandler(BaseDicomJsonHandler):
    """ Find instance tags

    Success

        - 200 - Tags found

    Failure
        - 404 - Instance not found
        - 401 - Not authorized user
        - 403 - User has not permissions for retrieving patients
    """

    @gen.coroutine
    def get(self, instance_id, *args, **kwargs):
        instance = Instance.objects.get(pk=instance_id)
        ds = read_file(instance.image.path)
        yield self.write(ds)


# GET /api/instances/:id/image
@required_auth(methods=['GET'])
class InstanceImageHandler(BaseDicomImageHandler):
    """ Find instance image

    Success

        - 200 - Instance image was found

    Failure
        - 404 - Instance not found
        - 401 - Not authorized user
        - 403 - User has not permissions for retrieving instances
    """

    @gen.coroutine
    def get(self, instance_id, *args, **kwargs):
        instance = Instance.objects.get(pk=instance_id)
        ds = read_file(instance.image.path)
        yield BaseDicomImageHandler.write(self, ds)


# GET /api/instances/:id/raw
@required_auth(methods=['GET'])
class InstanceRawHandler(BaseBytesHandler):
    """ Find instance image

        Success

            - 200 - Instance image was found

        Failure
            - 404 - Instance not found
            - 401 - Not authorized user
            - 403 - User has not permissions for retrieving instances
    """

    @gen.coroutine
    def get(self, instance_id, *args, **kwargs):
        img_format = self.get_query_argument('format', 'LUM_8')
        instance = Instance.objects.get(pk=instance_id)
        if img_format == 'LUM_8':
            yield self.write(convert_to_8bit(read_file(instance.image).pixel_array).tobytes())
        else:
            yield self.write(read_file(instance.image).PixelData)


# GET /api/plugins


@required_auth(methods=['GET'])
class PluginListHandler(ListHandler):
    """ Find plugins

    Success

        - 200 - Plugins were found

    Failure
        - 401 - Not authorized user
        - 403 - User has not permissions for retrieving patients
    """
    queryset = Plugin.objects.all()
    serializer_class = PluginSerializer

    def get(self, *args, **kwargs):
        serializer = self.serializer_class(self.queryset.all(), many=True)
        plugins = serializer.data
        self.write(plugins)


# GET /api/plugins/:id


@required_auth(methods=['GET', 'DELETE'])
class PluginDetailHandler(RetrieveDestroyHandler):
    """ Find plugin by id

    Success

        - 200 - Plugins were found

    Failure
        - 404 - Plugin not found
        - 401 - Not authorized user
        - 403 - User has not permissions for retrieving patients
    """
    queryset = Plugin.objects.all()
    serializer_class = PluginSerializer

    def delete(self, instance_id, *args, **kwargs):
        plugin = Plugin.objects.get(pk=instance_id)
        if not plugin.is_installed:
            self.write_error(500)
            self.write({
                'message': 'Plugin not %s installed!'
            })
            return
        pip.main(['uninstall', '--yes', plugin.name])
        plugin.delete()
        self.write({
            'message': 'Plugin %s was removed' % plugin
        })


class DICOMServer(netdicom.AE):
    logger = logging.getLogger('DICOMServer')

    def __init__(self, *args, **kwargs):
        super(DICOMServer, self).__init__(*args, **kwargs)

    def on_c_echo(self, context, info):
        logger.info('C-Echo succeeded')
        return 0x0000

    # def on_c_find(self, ds: Dataset, context, info):
    #     logger.info('C-Find processing request')
    #     logger.info(ds)
    #     qr_level = ds.QueryRetrieveLevel
    #     res_ds = Dataset()
    #     res_ds.QueryRetrieveLevel = ds.QueryRetrieveLevel
    #     res_ds.RetrieveAETitle = 'NEURDICOM'
    #     res_ds.PatientName = ds.get('PatientName', 'John Doe')
    #     status_ds = Dataset()
    #     status_ds.Status = 0x0000
    #     yield status_ds, res_ds
    #
    # def on_c_move(self, ds: Dataset, move_aet, context, info):
    #     logger.info('C-Find processing request')
    #     logger.info(ds)
    #
    # def on_c_get(self, ds: Dataset, context, info):
    #     logger.info('C-Get processing request')
    #     logger.info(ds)
    #     res_ds = Dataset()
    #     res_ds.QueryRetrieveLevel = ds.QueryRetrieveLevel
    #     res_ds.RetrieveAETitle = 'NEURDICOM'
    #     res_ds.PatientName = ds.get('PatientName', 'John Doe')
    #     status_ds = Dataset()
    #     status_ds.Status = 0xFF00
    #     yield status_ds, res_ds

    def on_c_store(self, ds: Dataset, context, info):
        logger.info('C-Store processing')
        file_meta = Dataset()
        file_meta.TransferSyntaxUID = ImplicitVRLittleEndian
        file_meta.MediaStorageSOPClassUID = ds.SOPClassUID
        file_meta.MediaStorageSOPInstanceUID = ds.SOPInstanceUID
        file_meta.ImplementationClassUID = '1.3.6.1.4.1.9590.100.1.0.100.4.0'
        fds = FileDataset(None, {}, file_meta=file_meta, preamble=b'\0' * 128)
        fds.update(ds)
        fds.is_little_endian = True
        fds.is_implicit_VR = True
        DicomSaver.save(fds)
        logger.info('C-Store succeeded')
        return 0x0000
