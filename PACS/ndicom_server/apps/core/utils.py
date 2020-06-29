from abc import abstractmethod
from io import BytesIO
from json import JSONEncoder
import numpy as np
import imageio
from PIL import Image
from pydicom import Sequence
from pydicom import read_file
from pydicom.dataelem import PersonName
from pydicom.multival import MultiValue
from pydicom.valuerep import DA, DT, TM, DSfloat, DSdecimal, IS

from apps.core.models import *


class DicomSaver:

    @classmethod
    def save(cls, img):
        print("save")
        if isinstance(img, Dataset):
            ds: Dataset = img
            img = BytesIO()
            img.seek(0)
            ds.save_as(img)
        else:
            ds: Dataset = read_file(img)
        if isinstance(img, str):
            img = open(img, 'rb')
        if Instance.objects.filter(sop_instance_uid=ds.SOPInstanceUID).exists():
            instance = Instance.objects.get(sop_instance_uid=ds.SOPInstanceUID)
            instance.image.delete()
            instance.image.save('', img)
            return instance
        elif Series.objects.filter(series_instance_uid=ds.SeriesInstanceUID).exists():
            series = Series.objects.get(series_instance_uid=ds.SeriesInstanceUID)
            instance = Instance.from_dataset(ds=ds)
            instance.series = series
            instance.image.save('', img)
            instance.save()
            img.close()
            return instance
        elif Study.objects.filter(study_instance_uid=ds.StudyInstanceUID).exists():
            study = Study.objects.get(study_instance_uid=ds.StudyInstanceUID)
            series = Series.from_dataset(ds=ds)
            series.study = study
            series.save()
            instance = Instance.from_dataset(ds=ds)
            instance.series = series
            instance.image.save('', img)
            instance.save()
            img.close()
            return instance

        if ds.PatientID is None or ds.PatientID == '':
            patient = Patient.from_dataset(ds=ds)
            patient.save()
            study = Study.from_dataset(ds=ds)
            study.patient = patient
            study.save()
            series = Series.from_dataset(ds=ds)
            series.study = study
            series.save()
            instance = Instance.from_dataset(ds=ds)
            instance.series = series
            instance.image.save('', img)
            instance.save()
            img.close()
            return instance
        elif Patient.objects.filter(patient_id=ds.PatientID):
            patient = Patient.objects.get(patient_id=ds.PatientID)
            study = Study.from_dataset(ds=ds)
            study.patient = patient
            study.save()
            series = Series.from_dataset(ds=ds)
            series.study = study
            series.save()
            instance = Instance.from_dataset(ds=ds)
            instance.series = series
            instance.image.save('', img)
            instance.save()
            img.close()
            return instance
        else:
            patient = Patient.from_dataset(ds=ds)
            patient.save()
            study = Study.from_dataset(ds=ds)
            study.patient = patient
            study.save()
            series = Series.from_dataset(ds=ds)
            series.study = study
            series.save()
            instance = Instance.from_dataset(ds=ds)
            instance.series = series
            instance.image.save('', img)
            instance.save()
            img.close()
            return instance


class BaseProcessor:

    @abstractmethod
    def process(self, img, **params):
        pass


class ImageProcessor(BaseProcessor):

    def __init__(self, plugin: Plugin):
        self.processor = __import__(plugin.name).Plugin()

    def __enter__(self):
        if hasattr(self.processor, "__enter__"):
            self.processor.__enter__()
        return self

    def process(self, instance: Instance, **params):
        ds = read_file(instance.image).pixel_array
        result = self.processor.process(ds, **params)
        return result

    def __exit__(self, exc_type, exc_val, exc_tb):
        if hasattr(self.processor, "__exit__"):
            self.processor.__exit__(exc_type, exc_val, exc_tb)
        return self


class DicomJsonEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, PersonName):
            return obj.original_string
        if isinstance(obj, MultiValue) or isinstance(obj, Sequence):
            return_list = []
            for value in obj:
                return_list.append(self.default(value))
            return return_list
        if isinstance(obj, DA):
            return '%d-%02d-%02d' % (obj.year, obj.month, obj.day)
        if isinstance(obj, DT):
            return '%d-%02d-%02d %02d:%02d:%02d' % (obj.year, obj.month, obj.day, obj.hour, obj.minute, obj.second)
        if isinstance(obj, TM):
            return '%02d:%02d:%02d' % (obj.hour, obj.minute, obj.second)
        if isinstance(obj, DSfloat):
            return str(obj)
        if isinstance(obj, DSdecimal):
            return str(obj)
        if isinstance(obj, IS):
            return obj.original_string or str(obj)
        if isinstance(obj, Dataset):
            child_tags = obj.dir()
            return_dict = {}
            for tag in child_tags:
                return_dict[tag] = self.default(obj.data_element(tag).value)
            return return_dict
        return str(obj)


def convert_dicom_to_img(ds: Dataset, img_format='jpeg'):
    pixel_array = ds.pixel_array
    file = BytesIO()
    imageio.imwrite(file, pixel_array, format='jpeg')
    file.seek(0)
    return file.read()


def convert_array_to_img(pixel_array: np.ndarray, fname, instance):
    file = BytesIO()
    imageio.imwrite(file, pixel_array, format='jpeg')
    file.seek(0)
    resave = ProcessingResult.objects.create(instance=instance, filename=fname)
    resave.result.save('', file)
    file.seek(0)
    return file.read()


def convert_img(ds: Dataset, img_max, img_min):
    pixel_array = ds.pixel_array
    pixel_array[pixel_array >= img_max] = img_max
    pixel_array[pixel_array <= img_min] = img_min
    file = BytesIO()
    imageio.imwrite(file, pixel_array, format='jpeg')
    file.seek(0)
    return file.read()
