from setuptools import setup, find_packages
import os.path as path

setup(
    name='ndicom_kmeans',
    version='0.0.1.dev1',
    author='Roman Baygildin',
    author_email='rbaygildin95@gmail.com',
    classifiers=[
        'Development Status :: 3 - Alpha',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python :: 3.6',
        'Topic :: Scientific/Engineering :: Medical Science Apps.',
    ],
    url='http://github.com/reactmed/neurdicom-plugins',
    license='MIT',
    keywords=['dicom', 'kmeans', 'image segmentation', 'medial images processing'],
    packages=find_packages(),
    install_requires=[
        'pydicom', 'dipy', 'numpy', 'opencv-python', 'scikit-learn'
    ],
    dependency_links=[
        "git+git://github.com/pydicom/pydicom"
    ],
    long_description=open(path.join(path.dirname(__file__), 'README.md')).read(),
    long_description_content_type='text/markdown'
)
