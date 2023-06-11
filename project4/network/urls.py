
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path('get-csrf-token', views.get_csrf_token, name='get-csrf-token'),
    path("posts", views.posts, name="posts"),
    path("profile/<str:username>", views.profile, name="profile"),
    path("following", views.following, name="following"),
    path("following_posts/<int:start>", views.following_posts, name="following_posts"),
    path("edit/<int:post_id>", views.edit, name="edit"),
    path("unfollow/<int:user_uf>", views.unfollow, name="unfollow"),
    path("follow/<int:user_f>", views.follow, name="follow"),
    path("like/<int:post_id>", views.like, name="like"),
    path("auth", views.auth, name="auth")
]
