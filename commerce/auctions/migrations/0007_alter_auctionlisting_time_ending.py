# Generated by Django 4.2.1 on 2023-05-26 16:42

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0006_alter_auctionlisting_image_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='auctionlisting',
            name='time_ending',
            field=models.DateTimeField(default=datetime.datetime(2023, 6, 2, 16, 42, 17, 131411, tzinfo=datetime.timezone.utc)),
        ),
    ]
