from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("create", views.create, name="create"),
    path("edit", views.edit, name="edit"),
    path("random", views.random_choice, name="random_choice"),
    path("<str:title>", views.entry_acquire, name="entry")
]
