# Generated by Django 4.2.1 on 2023-06-16 03:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0021_post_catergory'),
    ]

    operations = [
        migrations.RenameField(
            model_name='post',
            old_name='catergory',
            new_name='category',
        ),
    ]