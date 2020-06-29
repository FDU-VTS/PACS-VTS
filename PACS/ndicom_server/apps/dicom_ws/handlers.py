import pynetdicom as netdicom
from pydicom.uid import *
from pydicom import read_file, FileDataset
from tornado import gen
from apps.core.handlers import *
from apps.core.utils import *
from apps.dicom_ws.serializers import *
import pip

ECHO_SUCCESS = 0x0000
REPO_URL = 'git+git://github.com/reactmed/neurdicom-plugins.git'


# GET /api/patients
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


class SeriesProcessHandler(BaseNeurDicomHandler):
    def post(self, series_id, by_plugin_id, *args, **kwargs):
        instance_query = Instance.objects.filter(series_id=series_id)
        plugin = Plugin.objects.get(pk=by_plugin_id)
        params = self.request.arguments
        processor = ImageProcessor(plugin)
        for instance in instance_query:
            print(type(instance))
            rt = processor.process(instance, **params)
            res_name = str(plugin.name) + str(instance.pk) + '.jpeg'
            if not ProcessingResult.objects.filter(filename=res_name).exists():
                img = convert_array_to_img(rt, res_name, instance)


# GET /api/instances
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


class DcmUploadHander(BaseNeurDicomHandler):
    def post(self, *args, **kwargs):
        fileDict = self.request.files
        for name in fileDict:
            DicomSaver.save(BytesIO(self.request.files[name][0]['body']))


# GET /api/instances/:id
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
        res_name = str(plugin.name) + str(instance_id)
        if plugin.result['type'] == 'JSON':
            if isinstance(result, dict):
                result = json.dumps(result)
            yield self.write(self, result)
        else:
            yield self.send_error(500, message='result type is not Json')


# POST /api/instances/:id/process/by_plugin/:id/image
class InstanceImgProcessHandler(PluginImageHandler):
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
    def get(self, instance_id, by_plugin_id, *args, **kwargs):
        instance = Instance.objects.get(pk=instance_id)
        plugin = Plugin.objects.get(pk=by_plugin_id)
        params = self.request.arguments
        with ImageProcessor(plugin) as processor:
            rt = processor.process(instance, **params)
        res_name = str(plugin.name) + str(instance_id) + '.jpeg'
        if plugin.result['type'] == 'IMAGE':
            if not ProcessingResult.objects.filter(filename=res_name).exists():
                img = convert_array_to_img(rt, res_name, instance)
            else:
                res = ProcessingResult.objects.get(filename=res_name)
                rt = open(res.result.path, 'rb')
                img = rt.read()
            yield self.write(img)
        else:
            yield self.send_error(500, message='result type is not image')


# GET /api/instances/:id/tags
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
class InstanceImageHandler(BaseDicomImageHandler):
    """ Find instance image

    Success

        - 200 - Instance image was found

    Failure
        - 404 - Instance not found
        - 401 - Not authorized user
        - 403 - User has not permissions for retrieving instances
    """

    def get(self, instance_id, *args, **kwargs):
        instance = Instance.objects.get(pk=instance_id)
        ds = read_file(instance.image.path)
        return self.write(ds)


# GET /api/instances/:id/limit/:id/mid/:id
class InstanceConvertHandler(BaseDicomConverHandler):
    """ Find instance image

    Success

        - 200 - Instance image was found

    Failure
        - 404 - Instance not found
        - 401 - Not authorized user
        - 403 - User has not permissions for retrieving instances
    """

    def get(self, instance_id, limit, mid, *args, **kwargs):
        instance = Instance.objects.get(pk=instance_id)
        ds = read_file(instance.image.path)
        img_max = int(mid) + (int(limit)/2)
        img_min = int(mid) - (int(limit)/2)
        return self.write(ds, img_max, img_min)


# GET /api/instances/:id/raw
class InstanceRawHandler(BaseBytesHandler):
    """ Find instance image

        Success

            - 200 - Instance image was found

        Failure
            - 404 - Instance not found
            - 401 - Not authorized user
            - 403 - User has not permissions for retrieving instances
    """

    def get(self, instance_id, *args, **kwargs):
        img_format = self.get_query_argument('format', 'LUM_8')
        instance = Instance.objects.get(pk=instance_id)
        if img_format == 'LUM_8':
            yield self.write(convert_to_8bit(read_file(instance.image).pixel_array).tobytes())
        else:
            yield self.write(read_file(instance.image).PixelData)


# GET /api/plugins
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
