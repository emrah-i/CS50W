# Generated by Django 4.2.1 on 2023-06-16 08:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0028_alter_user_avatar'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='avatar',
        ),
    ]
