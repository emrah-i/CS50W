from django.contrib import admin
from .models import User, AuctionListing, Bid, Comment

class UserWatchList(admin.ModelAdmin):
    filter_horizontal = ("watchlist_items",)

admin.site.register(User, UserWatchList)
admin.site.register(AuctionListing)
admin.site.register(Bid)
admin.site.register(Comment)
# Register your models here.
