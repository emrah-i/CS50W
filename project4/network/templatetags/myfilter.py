from django import template

register = template.Library()

@register.filter
def sort_posts(posts, sort):
    if sort == "new_old":
        return sorted(posts, key=lambda post: post['upload_time'], reverse=True)
    elif sort == "old_new":
        return sorted(posts, key=lambda post: post['upload_time'])
    elif sort == "most_likes":
        return sorted(posts, key=lambda post: post['like_count'], reverse=True)
    elif sort == "least_likes":
        return sorted(posts, key=lambda post: post['like_count'])
    elif sort == "most_comments":
        return sorted(posts, key=lambda post: post['comment_count'], reverse=True)
    elif sort == "least_comments":
        return sorted(posts, key=lambda post: post['comment_count'])
    else:
        return posts