# Generated by Django 4.2.1 on 2023-05-29 17:12

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0017_remove_user_favorited_items_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='auctionlisting',
            name='time_ending',
            field=models.DateTimeField(default=datetime.datetime(2023, 6, 5, 17, 12, 11, 761010, tzinfo=datetime.timezone.utc)),
        ),
    ]
