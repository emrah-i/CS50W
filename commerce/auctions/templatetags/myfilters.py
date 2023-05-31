from django import template

register = template.Library()

@register.filter 
def shorten(value):
    value = value[:200]
    return value