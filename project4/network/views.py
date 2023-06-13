from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.middleware import csrf
from datetime import datetime
import json

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
        title = request.POST.get("title")

        newPost = Post.objects.create(user=user, text=text, title=title)
        newPost.save()

        return HttpResponseRedirect(reverse('index'))

    else:
        start = int(request.GET.get('start') or 0)
        end = int(request.GET.get('end') or (start + 4))
        sort = request.GET.get('sort')

        if sort == "new_old":
            posts = Post.objects.all().values('post', 'title', 'text','user', 'user__username', 'likes', 'comments', 'upload_time').order_by('-upload_time')
        elif sort == "old_new":
            posts = Post.objects.all().values('post', 'title', 'text','user', 'user__username', 'likes', 'comments', 'upload_time').order_by('upload_time')
        elif sort == "most_likes":
            posts = Post.objects.all().values('post', 'title', 'text','user', 'user__username', 'likes', 'comments', 'upload_time').order_by('-likes')
        elif sort == "least_likes":
            posts = Post.objects.all().values('post', 'title', 'text','user', 'user__username', 'likes', 'comments', 'upload_time').order_by('likes')
        elif sort == "most_comments":
            posts = Post.objects.all().values('post', 'title', 'text','user', 'user__username', 'likes', 'comments', 'upload_time').order_by('-comments')
        elif sort == "least_comments":
            posts = Post.objects.all().values('post', 'title', 'text','user', 'user__username', 'likes', 'comments', 'upload_time').order_by('comments')

        for post in posts:
            post["upload_time"] = post["upload_time"].strftime("%B %d %Y, %I:%M %p")

        data = []
        for post in posts[start:end + 1]:
            data.append(post)

        return JsonResponse(list(data), safe=False)
    
def post(request, post_id): 

    if request.method == "POST":
        
        text = request.POST.get('comment_text')
        user = request.user

        post = Post.objects.get(pk=post_id)
        new_comment = Comment.objects.create(user=user, post=post, text=text)
        new_comment.save()

        return HttpResponseRedirect(reverse('post', args=(post_id, )))

    else:
        post = Post.objects.filter(pk=post_id).values('post', 'title', 'text','user', 'user__username', 'likes', 'comments', 'upload_time')
        comment_post = Post.objects.get(pk=post_id)
        comments = Comment.objects.filter(post=comment_post).values('comment', 'text', 'user__username', 'upload_time').order_by('-upload_time')


        post = {
            'id': post[0]['post'],
            'title': post[0]['title'],
            'text': post[0]['text'],
            'user': post[0]['user'],
            'username': post[0]['user__username'],
            'likes': post[0]['likes'],
            'comments': post[0]['comments'],
            'upload_time': post[0]['upload_time'],
        }

        return render(request, "network/post.html", {
            'post': post,
            'comments': comments
        })

@login_required
def get_csrf_token(request):
    csrf_token = csrf.get_token(request)

    if request.user.is_authenticated:
        username = request.user.username
    
    
    return JsonResponse({'csrf_token': csrf_token, 'username': username})

def profile(request, username):
    
    user = User.objects.get(username = username)
    user_following = UserFollow.objects.filter(user = user)
    user_followers = UserFollow.objects.filter(is_now_following = user)
    sort = request.GET.get('sort')

    user_info  = {
        'id': user.id,
        'username': user.username,
        'following': len(user_following),
        'followers': len(user_followers),
    }

    following = UserFollow.objects.filter(user = user).values('is_now_following')
    followers = UserFollow.objects.filter(is_now_following = user).values('user')


    following_users = []
    for follow in following:
        current_user = User.objects.get(id = follow['is_now_following'])

        following_users.append(
            {
                'username': current_user.username,
                'id': current_user.id
            }
        )

    follower_users = []
    for follow in followers:
        current_user = User.objects.get(id = follow['user'])

        follower_users.append(
            {
                'username': current_user.username,
                'id': current_user.id
            }
        )

    posts = Post.objects.filter(user = user).all().values('post', 'title', 'text', 'likes','likes__username', 'comments', 'upload_time')

    for post in posts:
        if post['likes'] == None:
            post['likes'] = 0

        likers = Post.objects.get(pk=post['post'])
        likers_list = likers.likes.all()
        likers_list = [liker.username for liker in likers_list]

        if post['likes'] > 0:
            if request.user.username in likers_list:
                post['liked'] = True
            else:
                post['liked'] = False
        else:
            post['liked'] = False
    
    return render(request, "network/profile.html", {
        'posts': posts,
        'user_info': user_info, 
        'following_users': following_users,
        'follower_users': follower_users,
        'sort': sort
    })

@login_required
def following(request):

    user = request.user.id
    following = UserFollow.objects.filter(user = user).values('is_now_following')

    following_users = []
    for follow in following:
        following_users.append(follow['is_now_following'])

    following = []
    for user in following_users:
        following.append(User.objects.get(pk=user))

    return render(request, 'network/following.html', {
        'following_users': following
    })

@login_required
def following_posts(request, start, sort):

    user = request.user.id
    start_post = start
    end = start_post + 4

    following = UserFollow.objects.filter(user = user).values('is_now_following')


    following_users = []
    for follow in following:
        following_users.append(follow['is_now_following'])

    following = []
    for user in following_users:
        following.append(User.objects.get(pk=user))

    if sort == "new_old":
        following_posts = Post.objects.filter(user__in = following).values('post', 'title', 'text','user', 'user__username', 'likes', 'comments', 'upload_time').order_by('-upload_time')
    elif sort == "old_new":
        following_posts = Post.objects.filter(user__in = following).values('post', 'title', 'text','user', 'user__username', 'likes', 'comments', 'upload_time').order_by('upload_time')
    elif sort == "most_likes":
        following_posts = Post.objects.filter(user__in = following).values('post', 'title', 'text','user', 'user__username', 'likes', 'comments', 'upload_time').order_by('-likes')
    elif sort == "least_likes":
        following_posts = Post.objects.filter(user__in = following).values('post', 'title', 'text','user', 'user__username', 'likes', 'comments', 'upload_time').order_by('likes')
    elif sort == "most_comments":
        following_posts = Post.objects.filter(user__in = following).values('post', 'title', 'text','user', 'user__username', 'likes', 'comments', 'upload_time').order_by('-comments')
    elif sort == "least_comments":
        following_posts = Post.objects.filter(user__in = following).values('post', 'title', 'text','user', 'user__username', 'likes', 'comments', 'upload_time').order_by('comments')

    data = []
    for post in following_posts[start_post:end + 1]:
            post['upload_time'] = post['upload_time'].strftime("%B %d %Y, %I:%M %p")
            data.append(post)

    return JsonResponse(list(data), safe=False)

@csrf_exempt
@login_required
def edit(request, post_id):

    try:
        post = Post.objects.get(user=request.user, pk=post_id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)
    
    if request.method == "PUT":

        data = json.loads(request.body)
        if data.get("text") is not None:
            post.text = data["text"]
        if data.get("title") is not None:
            post.title = data["title"]
        post.save()
        return HttpResponse(status=204)
    
    elif request.method == "DELETE":

        post.delete()
    
    else:
        post_data = Post.objects.get(pk=post_id)
        
        data = {
            'post': post_data.post,
            'text': post_data.text,
            'title': post_data.title
        }

        return JsonResponse(data, safe=False)
    
@csrf_exempt
@login_required
def unfollow(request, user_uf): 

    try:
        user = request.user.id
        following = UserFollow.objects.get(user=user, is_now_following=user_uf)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Entry not found."}, status=404)

    following.delete()

@csrf_exempt
@login_required
def follow(request, user_f): 

    try:
        user = request.user
        follow_user = User.objects.get(id=user_f)
    except User.DoesNotExist:
        return JsonResponse({"error": "Entry not found."}, status=404)

    follow = UserFollow.objects.create(user=user, is_now_following=follow_user)
    follow.save()

@csrf_exempt
@login_required
def like(request, post_id):

    try:
        user = request.user
        post = Post.objects.get(pk=post_id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)

    
    if request.method == "POST":

        post.likes.add(user)
        data = {'message': 'Post request processed successfully'}
        return JsonResponse(data, safe=True)

    elif request.method == "PUT": 

        post.likes.remove(user)
        data = {'message': 'Put request processed successfully'}
        return JsonResponse(data, safe=True)

    else:

        for liker in post.likes.all():
            if user == liker:
                data = True
                return JsonResponse(data, safe=False)
        
        data = False
        return JsonResponse(data, safe=False)
        

@login_required
def auth(request):

    if request.user.is_authenticated: 
        user = True
        return JsonResponse(user, safe=False)
    else:
        user = False
        return JsonResponse(user, safe=False)