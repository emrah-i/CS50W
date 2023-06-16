from django import template

register = template.Library()

@register.filter
def sort_posts(posts, sort):
    if sort == "new_old":
        return sorted(posts, key=lambda post: post.get('upload_time'), reverse=True)
    elif sort == "old_new":
        return sorted(posts, key=lambda post: post.get('upload_time'))
    elif sort == "most_likes":
        return sorted(posts, key=lambda post: post.get('like_count'), reverse=True)
    elif sort == "least_likes":
        return sorted(posts, key=lambda post: post.get('like_count'))
    elif sort == "most_comments":
        return sorted(posts, key=lambda post: post.get('comments_count'), reverse=True)
    elif sort == "least_comments":
        return sorted(posts, key=lambda post: post.get('comments_count'))
    else:
        return posts