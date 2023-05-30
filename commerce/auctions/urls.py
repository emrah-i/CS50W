from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("create_listing", views.create_listing, name="create"),
    path("active_listings", views.active_listing, name="active"),
    path("watchlist", views.watchlist, name="watchlist"),
    path("update", views.update, name="update"),
    path("my_items", views.my_items, name="my_items"),
    path("listing/<int:listing>", views.listing, name="listing")
]
