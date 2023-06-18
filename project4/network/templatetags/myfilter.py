from django import template
from django.utils.safestring import mark_safe

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
    
@register.filter
def limit(text):
    if len(text) > 150:
        truncated_text = text[:150]
        read_more = '...(read more)'
        styled_read_more = f'<span style="font-style: italic; color: lightGray;">{read_more}</span>'
        return mark_safe(truncated_text + styled_read_more)
    else: 
        return text