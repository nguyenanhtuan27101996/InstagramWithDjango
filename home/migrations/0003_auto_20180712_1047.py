# Generated by Django 2.0.6 on 2018-07-12 10:47

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0002_auto_20180712_1041'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='birth_day',
            field=models.DateField(blank=True, default=datetime.datetime(2018, 7, 12, 10, 47, 4, 121738, tzinfo=utc)),
        ),
    ]
