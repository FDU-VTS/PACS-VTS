from skfuzzy.cluster import cmeans
from pydicom import Dataset
import numpy as np
import cv2 as cv
from dipy.segment.mask import median_otsu


class Plugin:

    def __enter__(self):
        print('FCM: plugin is starting')

    def process(self, img, **kwargs):
        n_clusters = kwargs.get('n_clusters', 3)
        m = kwargs.get('m', 2)
        eps = kwargs.get('eps', 0.01)
        max_it = kwargs.get('max_it', 100)
        numpass = kwargs.get('numpass', 5)
        median_radius = kwargs.get('median_radius', 10)
        if isinstance(img, Dataset):
            img = img.pixel_array
        img, _ = median_otsu(img, numpass=numpass, median_radius=median_radius)
        flat = img.reshape((1, -1))
        c, u, a1, a2, a3, a4, a5 = cmeans(flat, n_clusters, m, eps, max_it)
        tumor_index = np.argmax(c, axis=0)
        defuz = np.argmax(u, axis=0)
        mask = np.full(defuz.shape[0], 0, dtype=np.uint16)
        mask[defuz == tumor_index] = 1
        mask = mask.reshape(img.shape)
        k1 = np.ones((3, 3), np.uint16)
        k2 = np.ones((5, 5), np.uint16)
        mask = cv.erode(mask, k2, iterations=1)
        mask = cv.dilate(mask, k1, iterations=1)
        mask = cv.erode(mask, k2, iterations=2)
        mask = cv.dilate(mask, k1, iterations=5)
        return mask

    def __exit__(self, exc_type, exc_val, exc_tb):
        print('FCM: plugin destroys context')
