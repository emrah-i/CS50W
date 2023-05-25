from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django import forms  
from markdown2 import Markdown
import shutil
import random
import os

from . import util
    

def index(request):

    if request.method == "POST": 
        title = request.POST.get("search")
        list = util.filter(title)
        if len(list) is 0:
            return render(request, "encyclopedia/results.html", {
            "message": "Nothing matches that search"
        })
        elif len(list) is 1 and title.lower() == list[0].lower():
            title2 = util.get_entry(list[0])
            return render(request, "encyclopedia/page.html", {
                "title": Markdown().convert(title2)
            })
        else:
            return render(request, "encyclopedia/results.html", {
                "list": list
            })
 
    else: 
        return render(request, "encyclopedia/index.html", {
            "entries": util.list_entries()
        })

def entry_acquire(request, title):

    entry = util.get_entry(title)

    if entry is None: 
        return render(request, "encyclopedia/error.html")
    
    else:
        return render(request, "encyclopedia/page.html", {
            "title": Markdown().convert(entry),
            "name": title
        })
                  
def create(request):
    entry_list = util.list_entries()

    if request.method == "POST":
        entry_title = request.POST.get("title")
        entry_text = request.POST.get("md_text")

        if entry_title.lower() in [entry.lower() for entry in entry_list]:
            message = "That title exists. Please choose a unique title."
            return render(request, "encyclopedia/create.html", {
                "entry_text": entry_text,
                "message": message
            })
        else:
            file = open(f"{entry_title.capitalize()}.md", "w")
            file.write(entry_text)
            file.close()
            source_file = f"{entry_title.capitalize()}.md"
            destination_folder = "/Users/emrakh/Desktop/CS50W/wiki/entries"
            shutil.move(source_file, destination_folder)
            entry = util.get_entry(entry_title.capitalize())
            return render(request, "encyclopedia/page.html", {
                "title": Markdown().convert(entry)
                })

    else:
        return render(request, "encyclopedia/create.html")

def edit(request): 

    type = request.POST.get("button_value")

    if type == "edit":
        name = request.POST.get("title")
        md_page = util.get_entry(name)
        return render(request, "encyclopedia/edit.html", {
            "name": name,
            "entry_text": md_page
        })

    elif type == "save": 
        name = request.POST.get("old_title")
        entry_title = request.POST.get("title")
        entry_text = request.POST.get("md_text")
        file = open(f"/Users/emrakh/Desktop/CS50W/wiki/entries/{name}.md", "w")
        original_name = f"/Users/emrakh/Desktop/CS50W/wiki/entries/{name}.md"
        new_name = f"/Users/emrakh/Desktop/CS50W/wiki/entries/{entry_title}.md"
        os.rename(original_name, new_name)
        file.write(entry_text)
        file.close()
        return HttpResponseRedirect(f"/{entry_title}")

def random_choice(request):

    full_list = util.list_entries()
    entry = random.choice(full_list)
    
    return HttpResponseRedirect(f"/{entry}")



