from django import template

register = template.Library()

@register.filter 
def shorten(value, arg):
    value = value[:arg]
    
    return value