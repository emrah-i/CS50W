# Generated by Django 4.2.1 on 2023-05-29 18:14

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0020_rename_watchlist_item_user_watchlist_items_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='auctionlisting',
            name='time_ending',
            field=models.DateTimeField(default=datetime.datetime(2023, 6, 5, 18, 14, 25, 404594, tzinfo=datetime.timezone.utc)),
        ),
    ]