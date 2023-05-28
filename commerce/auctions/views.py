from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from .models import User, AuctionListing, Bid, Comment


def index(request):
    all = AuctionListing.objects.all()

    return render(request, "auctions/index.html", {
        "auction_listing": all
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")

def create_listing(request):

    CATERGORIES = ["Books", "Clothing", "Computers", "Jewlery"]

    if request.method == "POST":
        title = request.POST.get("title")
        description = request.POST.get("description")
        img_url = request.POST.get("image_url")
        strt_bid = request.POST.get("starting_bid")
        catergory = request.POST.get("catergory")

        if not title or not description or not strt_bid or not catergory:
            message = "You must fill all fields (except image)"
            return render(request, "auctions/create_listing.html", {
                "message": message
            })

        new_listing = AuctionListing(is_active = "Y", title = title, description = description, current_price = strt_bid, image = img_url, catergory = catergory)
        new_listing.save()

        return HttpResponseRedirect(reverse("index"))

    else:
        return render(request, "auctions/create_listing.html", {
            "catergories": CATERGORIES
        })

def active_listing(request):
    return render(request, "auctions/active_listings.html")

def listing(request, listing):
    item = AuctionListing.objects.get(id=listing)

    return render(request, "auctions/listing.html", {
        "item": item
    })