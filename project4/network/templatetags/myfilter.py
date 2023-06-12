from django import template

register = template.Library()

@register.filter
def sort_posts(posts, sort):
    if sort == "new_old":
        return sorted(posts, key=lambda post: post.get('upload_time'), reverse=True)
    elif sort == "old_new":
        return sorted(posts, key=lambda post: post.get('upload_time'))
    elif sort == "most_likes":
        return sorted(posts, key=lambda post: post.get('likes'), reverse=True)
    elif sort == "least_likes":
        return sorted(posts, key=lambda post: post.get('likes'))
    elif sort == "most_comments":
        return sorted(posts, key=lambda post: post.get('comments'), reverse=True)
    elif sort == "least_comments":
        return sorted(posts, key=lambda post: post.get('comments'))
    else:
        return posts