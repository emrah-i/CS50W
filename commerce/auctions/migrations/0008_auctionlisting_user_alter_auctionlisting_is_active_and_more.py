# Generated by Django 4.2.1 on 2023-05-26 23:35

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0007_alter_auctionlisting_time_ending'),
    ]

    operations = [
        migrations.AddField(
            model_name='auctionlisting',
            name='user',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='auctionlisting',
            name='is_active',
            field=models.CharField(choices=[('Y', 'Active'), ('N', 'Inactive')], max_length=1),
        ),
        migrations.AlterField(
            model_name='auctionlisting',
            name='time_ending',
            field=models.DateTimeField(default=datetime.datetime(2023, 6, 2, 23, 35, 29, 666290, tzinfo=datetime.timezone.utc)),
        ),
    ]
