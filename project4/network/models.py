from typing import Any
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError


class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    username = models.CharField(unique=True, max_length=26)
    datetime_joined = models.DateTimeField(default=timezone.now)

class UserFollow(models.Model):
    user = models.ForeignKey('User', related_name="user", on_delete=models.CASCADE, verbose_name="User")
    is_now_following = models.ForeignKey('User', related_name="is_now_following", on_delete=models.CASCADE, verbose_name="User")
    datetime_followed = models.DateTimeField(default=timezone.now)

    def clean(self):
            if self.user == self.is_now_following:
                raise ValidationError("A user cannot follow themselves")
            
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'is_now_following'], name='unique-following-follower')
        ]

    def __str__(self):
        return f"{self.user} followed {self.is_now_following.username} at {self.datetime_followed}"

class Post(models.Model):
    post = models.AutoField(primary_key=True)
    text = models.CharField(max_length=2000)
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name="post_poster")
    likes = models.ManyToManyField('User', related_name="post_ikers")
    comments = models.ForeignKey('Comment', blank=True, null=True, on_delete=models.CASCADE, related_name="post_comments")
    upload_time = models.DateTimeField(default=timezone.now)

class Comment(models.Model):
    comment = models.AutoField(primary_key=True)
    post = models.ForeignKey('Post', on_delete=models.CASCADE, related_name="comment_post")
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name="comment_poster")
    likes = models.ManyToManyField('User', related_name="comment_likers")
    upload_time = models.DateTimeField(default=timezone.now)