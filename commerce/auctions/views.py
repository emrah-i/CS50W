from django.contrib.auth import authenticate, login, logout, get_user
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.db.models import Max

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
    comments = Comment.objects.filter(item_id=listing)

    query = Bid.objects.filter(item_id = item.id)
    greatest_value = query.order_by('-amount').first()
    item.current_price = greatest_value.amount
    item.save()

    return render(request, "auctions/listing.html", {
        "item": item,
        "comments": comments
    })

def update(request):

    item = request.POST.get("item")
    item_listing = AuctionListing.objects.get(id = item)
    user = get_user(request)
    update_user = User.objects.get(id = user.id)


    if request.POST.get("button") == "watchlist":
        update_user.watchlist_items.add(item_listing)

        return HttpResponseRedirect(reverse("listing", args=item))

    elif request.POST.get("button") == "bid":
        bid = request.POST.get("starting_bid")
        update_bid = Bid(amount = bid, item_id = item_listing, user = user)
        update_bid.save()
        item_listing.current_price = bid
        item_listing.save()

        return HttpResponseRedirect(reverse("listing", args=item))

    elif request.POST.get("button") == "comment":
        rating = request.POST.get("rating")
        comment = request.POST.get("comment")

        if rating == "N/A":
            rating = None
        
        new_comment = Comment(rating = rating, comment = comment, user = user, item_id = item_listing)
        new_comment.save()

        return HttpResponseRedirect(reverse("listing", args=item))
    
def watchlist(request):
    user = get_user(request)
    user_items = User.objects.get(id = user.id)
    items = user_items.watchlist_items.all()

    return render(request, "auctions/watchlist.html", {
        "items": items
    })
