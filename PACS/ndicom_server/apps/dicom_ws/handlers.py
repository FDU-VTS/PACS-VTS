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
@required_auth(methods=['GET'])
class PatientDetailHandler(RetrieveHandler):
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
@required_auth(methods=['GET'])
class SeriesDetailHandler(RetrieveHandler):
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


# POST /api/instances/:id/process/by_plugin/:id
@required_auth(methods=['POST'])
class InstanceProcessHandler(BaseJsonHandler, BaseBytesHandler):
    """ Process an instances with specified plugin (or filter)

    Success

        - 200 - OK

    Failure
        - 404 - Instance or plugin were not found
        - 500 - Process error
        - 401 - Not authorized user
        - 403 - User has not permissions for retrieving patients
    """

    # def prepare(self):
    #     super(BaseNeurDicomHandler, self).prepare()
    #     if self.request.body:
    #         try:
    #             json_data = json.loads(self.request.body)
    #             self.request.arguments.update(json_data)
    #         except ValueError:
    #             self.send_error(400, message='Body is not JSON deserializable')
    #
    # def _convert(self, v, t):
    #     if t == 'int':
    #         return int(v)
    #     else:
    #         return float(v)

    @gen.coroutine
    def post(self, instance_id, by_plugin_id, *args, **kwargs):
        instance = Instance.objects.get(pk=instance_id)
        plugin = Plugin.objects.get(pk=by_plugin_id)
        params = self.request.arguments
        with ImageProcessor(plugin) as processor:
            result = processor.process(instance, **params)

        # for k in plugin.params:
        #     if plugin.params[k].get('is_array', False):
        #         v = self.get_query_arguments(k, None)
        #     else:
        #         v = self.get_query_argument(k, None)
        #     if v is not None:
        #         if isinstance(v, list) or isinstance(v, tuple):
        #             params[k] = [self._convert(item, plugin.params[k]['type']) for item in v]
        #         else:
        #             params[k] = self._convert(v, plugin.params[k]['type'])

        if plugin.result['type'] == 'IMAGE':
            if isinstance(result, BytesIO):
                result = result.getvalue()
            else:
                result = convert_to_8bit(result).tobytes()
            yield BaseBytesHandler.write(self, result)
        elif plugin.result['type'] == 'JSON':
            if isinstance(result, dict):
                result = json.dumps(result)
            yield BaseJsonHandler.write(self, result)
        else:
            self.send_error(500, message='Unknown result type')


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
        yield self.write(ds)


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


# GET /api/dicom_nodes
# @required_auth(methods=['GET', 'POST'])
class DicomNodeListHandler(ListCreateHandler):
    """ Find DICOM nodes

    Success

        - 200 - All nodes found

    Failure
        - 401 - Not authorized user
        - 403 - User has not permissions for retrieving patients
    """
    queryset = DicomNode.objects.all()
    serializer_class = DicomNodeSerializer


# GET /api/dicom_nodes/:id
@required_auth(methods=['GET', 'DELETE'])
class DicomNodeDetailHandler(RetrieveDestroyHandler):
    """ Find DICOM node by id

    Success

        - 200 - All nodes found

    Failure
        - 404 - DICOM node not found
        - 401 - Not authorized user
        - 403 - User has not permissions for retrieving patients
    """
    queryset = DicomNode.objects.all()
    serializer_class = DicomNodeSerializer


@required_auth(methods=['GET'])
@render_exception
class DicomNodeInstancesLoadHandler(BaseJsonHandler):
    """ Load and save DICOM files from remote DICOMWeb peers

        Success

            - 200 - All images saved

        Failure
            - 404 - DICOM node not found
            - 401 - Not authorized user
            - 403 - User has not permissions for retrieving patients
        """

    expected_path_params = ['dicom_node_id']

    @asynchronous
    def get(self, *args, **kwargs):
        dicom_node_id = self.path_params['dicom_node_id']
        dicom_node = DicomNode.objects.get(pk=dicom_node_id)
        client = AsyncHTTPClient()
        find_instance_url = '%s/%s' % (dicom_node.remote_url, dicom_node.instances_url)
        client.fetch(find_instance_url, lambda resp: self._on_get_instances(resp, dicom_node))

    @asynchronous
    def _on_get_instances(self, response, dicom_node):
        print('Find instances')
        if response.code >= 400:
            msg = {

            }
            self.set_status(response.code)
            if response.code == 599:
                msg['message'] = 'Удаленный сервер DICOM %s недоступен' % dicom_node.remote_url
            if response.code == 401:
                msg['message'] = 'Удаленный сервер DICOM %s требует авторизации' % dicom_node.remote_url
            else:
                msg['message'] = 'Удаленный сервер DICOM %s не может выполнить операцию' % dicom_node.remote_url
            self.finish()
            return
        instances = json.loads(response.body)
        for instance_id in instances:
            download_image_url = '%s/%s' % (dicom_node.remote_url, dicom_node.instance_file_url)
            download_image_url = download_image_url.replace('{id}', instance_id)
            client = AsyncHTTPClient()
            client.fetch(download_image_url, lambda resp: self._on_download_image(resp, dicom_node))
        self.finish()

    def _on_download_image(self, response, dicom_node):
        print('Download image')
        if response.code >= 400:
            msg = {

            }
            self.set_status(response.code)
            if response.code == 599:
                msg['message'] = 'Удаленный сервер DICOM %s недоступен' % dicom_node.remote_url
            if response.code == 401:
                msg['message'] = 'Удаленный сервер DICOM %s требует авторизации' % dicom_node.remote_url
            else:
                msg['message'] = 'Удаленный сервер DICOM %s не может выполнить операцию' % dicom_node.remote_url
            self.write(msg)
            self.finish()
            return
        img = BytesIO(response.body)
        img.seek(0)
        DicomSaver.save(img)
        print(response)


# GET /api/dicom_nodes/:id/echo
# @required_auth(methods=['GET'])
# class DicomNodeEchoHandler(BaseJsonHandler):
#     """ Make ECHO request to DICOM node
#
#     Success
#
#         - 200 - ECHO succeeded
#
#     Failure
#         - 404 - DICOM node not found
#         - 500 - ECHO failed
#         - 401 - Not authorized user
#         - 403 - User has not permissions for retrieving patients
#     """
#     expected_path_params = ['dicom_node_id']
#
#     def get(self, *args, **kwargs):
#         dicom_node_id = self.path_params['dicom_node_id']
#         dicom_node = DicomNode.objects.get(pk=dicom_node_id)
#         ae = netdicom.AE(ae_title=dicom_node.aet_title, scu_sop_class=['1.2.840.10008.1.1'])
#         assoc = ae.associate(dicom_node.peer_host, dicom_node.peer_port, ae_title=dicom_node.peer_aet_title)
#         if assoc.is_established:
#             status = assoc.send_c_echo()
#             if status.Status == ECHO_SUCCESS:
#                 self.set_status(200)
#                 self.finish()
#                 return
#         self.send_error(500, message='Echo failed')

# GET /api/dicom_nodes/:id/echo
# @required_auth(methods=['GET'])
# class DicomNodeEchoHandler(BaseJsonHandler):
#     """ Make ECHO request to DICOM node
#
#     Success
#
#         - 200 - ECHO succeeded
#
#     Failure
#         - 404 - DICOM node not found
#         - 500 - ECHO failed
#         - 401 - Not authorized user
#         - 403 - User has not permissions for retrieving patients
#     """
#     expected_path_params = ['dicom_node_id']
#
#     def get(self, *args, **kwargs):
#         dicom_node_id = self.path_params['dicom_node_id']
#         dicom_node = DicomNode.objects.get(pk=dicom_node_id)
#         resp = os.system('ping -c 1 %s:%s' % (dicom_node.peer_host, dicom_node.peer_port))
#         if resp != 0:
#             self.send_error(500, message='Echo failed')

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


@required_auth(methods=['POST'])
@render_exception
class InstallPluginHandler(CreateHandlerMixin):
    def post(self, plugin_name, *args, **kwargs):
        plugin = install_from_pypi(plugin_name)
        self.write(PluginSerializer(plugin).data)


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
