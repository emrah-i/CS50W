from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from datetime import timedelta
from django.utils import timezone
from django.db import models

end_time = timezone.now() + timedelta(days=7)

CATERGORIES = (
("BKS", "Books"),
("CLT", "Clothing"),
("CMP", "Computers"),
("JWL", "Jewelery")
)

ACTIVE_STATUS = (
("Y", "Yes"),
("N", "No")
)

class User(AbstractUser):
    email = models.EmailField(blank=False, unique=True)
    date_joined = models.DateTimeField(default=timezone.now)

class AuctionListings(models.Model):
    id = models.AutoField(primary_key=True)
    is_active = models.CharField(max_length=1, choices=ACTIVE_STATUS)
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=2000)
    current_price = models.DecimalField(max_digits=6, decimal_places=2)
    photo = models.ImageField()
    catergory = models.CharField(max_length=3, choices=CATERGORIES)
    item_comments = models.ManyToManyField('Comments', blank=True)
    item_ratings = models.ManyToManyField('Ratings', blank=True)
    time_added = models.DateTimeField(default=timezone.now)
    time_ending = models.DateTimeField(default=end_time)

class Bids(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    item_id = models.ForeignKey('AuctionListings', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=6, decimal_places=2)

class Comments(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    item_id = models.ForeignKey('AuctionListings', on_delete=models.CASCADE)
    comment = models.CharField(max_length=255)

class Ratings(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    item_id = models.ForeignKey('AuctionListings', on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(validators=[
        (MinValueValidator(1)),
        (MaxValueValidator(5))
    ])