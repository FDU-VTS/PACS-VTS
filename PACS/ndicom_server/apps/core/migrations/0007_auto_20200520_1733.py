# Generated by Django 2.2 on 2020-05-20 17:33

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_auto_20200520_1730'),
    ]

    operations = [
        migrations.AlterField(
            model_name='instance',
            name='color_space',
            field=models.CharField(blank=True, max_length=50, null=True, verbose_name='Color Space'),
        ),
        migrations.AlterField(
            model_name='instance',
            name='photometric_interpretation',
            field=models.CharField(blank=True, max_length=50, null=True, verbose_name='Photometric Interpretation'),
        ),
        migrations.AlterField(
            model_name='instance',
            name='pixel_aspect_ratio',
            field=models.CharField(blank=True, max_length=50, null=True, verbose_name='Pixel Aspect Ratio'),
        ),
        migrations.AlterField(
            model_name='instance',
            name='pixel_spacing',
            field=models.CharField(blank=True, max_length=50, null=True, verbose_name='Pixel Spacing'),
        ),
        migrations.AlterField(
            model_name='user',
            name='date_joined',
            field=models.DateTimeField(default=datetime.datetime(2020, 5, 20, 17, 33, 8, 162619)),
        ),
    ]
