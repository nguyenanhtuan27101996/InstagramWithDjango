# Generated by Django 2.0.6 on 2018-07-12 10:40

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('website', models.URLField(default='')),
                ('description', models.CharField(default='', max_length=200)),
                ('phone', models.CharField(default='', max_length=20)),
                ('status', models.IntegerField(choices=[(1, 'Male'), (2, 'Female'), (3, 'Unknown')], default=1)),
                ('avatar', models.ImageField(blank=True, upload_to='profile_images')),
                ('birth_day', models.DateField(blank=True, default=datetime.date(2018, 7, 12))),
                ('user', models.OneToOneField(default=0, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
