from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.middleware import csrf
from datetime import datetime

from .models import User, Post, UserFollow, Comment

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
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


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
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
    

def index(request):
    return render(request, "network/index.html")

def posts(request):

    if request.method == "POST":
        
        user = User.objects.get(username = request.user.username)
        text = request.POST.get("text")

        newPost = Post.objects.create(user = user, text = text)
        newPost.save()

        return HttpResponseRedirect(reverse('index'))

    else:
        start = int(request.GET.get('start') or 0)
        end = int(request.GET.get('end') or (start + 4))

        posts = Post.objects.all().values('post', 'text', 'user__username', 'likes', 'comments', 'upload_time').order_by('-upload_time')

        for post in posts:
            post["upload_time"] = post["upload_time"].strftime("%B %d %Y, %I:%M %p")

        data = []
        for post in posts[start:end + 1]:
            data.append(post)

        return JsonResponse(list(data), safe=False)

def get_csrf_token(request):
    csrf_token = csrf.get_token(request)

    if request.user.is_authenticated:
        username = request.user.username
    
    
    return JsonResponse({'csrf_token': csrf_token, 'username': username})

def profile(request, username):
    
    user = User.objects.get(username = username)
    user_following = UserFollow.objects.filter(user = user)
    user_followers = UserFollow.objects.filter(is_now_following = user)

    user_info  = {
        'username': user.username,
        'following': len(user_following),
        'followers': len(user_followers)
    }


    posts = Post.objects.filter(user = user).all().values('post', 'text', 'likes', 'comments', 'upload_time').order_by('-upload_time')

    for post in posts:
        if post["likes"] is not None:
            post["likes_count"] = len(post["likes"])
        else:
            post["likes_count"] = 0
            
        if post["comments"] is not None:
            post["comments_count"] = len(post["comment"])
        else:
            post["comments_count"] = 0


    return render(request, "network/profile.html", {
        'posts': posts,
        'user_info': user_info
    })

@login_required
def following(request):

    user = request.user.id
    following = UserFollow.objects.filter(user = user).values('is_now_following')

    following_users = []
    for follow in following:
        following_users.append(follow['is_now_following'])


    following_posts = Post.objects.filter(user__in = following_users).values('post', 'user__username', 'text', 'likes', 'comments', 'upload_time').order_by('-upload_time')

    for post in following_posts:
        if post["likes"] is not None:
            post["likes_count"] = len(post["likes"])
        else:
            post["likes_count"] = 0
            
        if post["comments"] is not None:
            post["comments_count"] = len(post["comment"])
        else:
            post["comments_count"] = 0

    return render(request, 'network/following.html', {
        'following_posts': following_posts
    })

@csrf_exempt
@login_required
def edit(request):
    
    if request.method == "POST":
        pass 

    else:
        post = int(request.GET.get('post'))
        post_data = Post.objects.get(pk=post)
        
        data = {
            'post': post_data.post,
            'text': post_data.text,
        }

        return JsonResponse(data, safe=False)