# Generated by Django 4.2.1 on 2023-06-16 09:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0032_remove_post_comments_post_comments'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='comments',
        ),
        migrations.AddField(
            model_name='post',
            name='comments',
            field=models.ManyToManyField(blank=True, null=True, related_name='post_comments', to='network.comment'),
        ),
    ]