from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from datetime import timedelta
from django.utils import timezone
from django.db import models

CATERGORIES = (
    ("BKS", "Books"),
    ("CLT", "Clothing"),
    ("CMP", "Computers"),
    ("JWL", "Jewelery")
)

ACTIVE_STATUS = (
("Y", "Active"),
("N", "Inactive")
)

class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    email = models.EmailField(null=False, unique=True)
    date_joined = models.DateTimeField(default=timezone.now)
    watchlist_items = models.ManyToManyField('AuctionListing', related_name='+', null=True, blank=True)

class AuctionListing(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey('User', on_delete=models.CASCADE, default=1, related_name="Owner")
    is_active = models.CharField(max_length=1, choices=ACTIVE_STATUS)
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=2000)
    auction_winner = models.ForeignKey('User', null=True, blank=True, on_delete=models.CASCADE, related_name="Winner")
    current_price = models.DecimalField(max_digits=6, decimal_places=2)
    image = models.CharField(max_length=200, null=True)
    catergory = models.CharField(max_length=3, choices=CATERGORIES)
    time_added = models.DateTimeField(default=timezone.now)
    time_ending = models.DateTimeField(default=(timezone.now() + timedelta(days=7)))

    def __str__(self):
        return f"Listing {self.id}: {self.title} by {self.user} (active: {self.is_active})"

class Bid(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    item_id = models.ForeignKey('AuctionListing', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return f"Bid {self.id}: ${self.amount} made by user {self.user} on item {self.item_id}"

class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    item_id = models.ForeignKey('AuctionListing', on_delete=models.CASCADE)
    comment = models.CharField(max_length=255)
    rating = models.PositiveIntegerField(null=True, blank=True, validators=[
        (MinValueValidator(0)),
        (MaxValueValidator(5))
    ])

    def __str__(self):
        return f"Comment {self.id}: made by user {self.user} on item {self.item_id} with a rating of {self.rating}/5"
