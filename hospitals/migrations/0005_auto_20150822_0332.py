# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hospitals', '0004_auto_20150820_1829'),
    ]

    operations = [
        migrations.AddField(
            model_name='hospital',
            name='latitude',
            field=models.DecimalField(null=True, max_digits=12, decimal_places=9),
        ),
        migrations.AddField(
            model_name='hospital',
            name='longitude',
            field=models.DecimalField(null=True, max_digits=12, decimal_places=9),
        ),
    ]
