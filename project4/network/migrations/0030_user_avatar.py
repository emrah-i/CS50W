# Generated by Django 4.2.1 on 2023-06-16 08:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0029_remove_user_avatar'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='avatar',
            field=models.ImageField(default='network/images/default.jpeg', upload_to='network/images/'),
        ),
    ]