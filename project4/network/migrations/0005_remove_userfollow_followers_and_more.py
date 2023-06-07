# Generated by Django 4.2.1 on 2023-06-07 08:48

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0004_alter_userfollow_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userfollow',
            name='followers',
        ),
        migrations.RemoveField(
            model_name='userfollow',
            name='following',
        ),
        migrations.AddField(
            model_name='userfollow',
            name='followers',
            field=models.ManyToManyField(related_name='followers', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='userfollow',
            name='following',
            field=models.ManyToManyField(related_name='following', to=settings.AUTH_USER_MODEL),
        ),
    ]
