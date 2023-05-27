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
    email = models.EmailField(blank=False, unique=True)
    date_joined = models.DateTimeField(default=timezone.now)

class AuctionListing(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey('User', on_delete=models.CASCADE, default=1)
    is_active = models.CharField(max_length=1, choices=ACTIVE_STATUS)
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=2000)
    current_price = models.DecimalField(max_digits=6, decimal_places=2)
    image = models.CharField(max_length=200, blank=True)
    catergory = models.CharField(max_length=3, choices=CATERGORIES)
    item_comments = models.ManyToManyField('Comment', blank=True)
    item_ratings = models.ManyToManyField('Rating', blank=True)
    time_added = models.DateTimeField(default=timezone.now)
    time_ending = models.DateTimeField(default=(timezone.now() + timedelta(days=7)))

    def __str__(self):
        return f"Listing {self.id}: {self.title} at ${self.current_price} (active: {self.is_active}) by {self.user}"

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

    def __str__(self):
        return f"Comment {self.id}: made by user {self.user} on item {self.item_id}"

class Rating(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    item_id = models.ForeignKey('AuctionListing', on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(validators=[
        (MinValueValidator(1)),
        (MaxValueValidator(5))
    ])

    def __str__(self):
        return f"Rating {self.id}: {self.rating} / 5 made by user {self.user} on item {self.item_id}"