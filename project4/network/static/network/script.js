
let counter = 0

document.addEventListener("DOMContentLoaded", () => {

    try {
        document.querySelector('#new_post').addEventListener('click', (event) => {
            if (event.target.matches('#cancel')) {
                cancel_new_post();
            }
        });
        document.querySelector('#new_post_button').addEventListener('click', load_new_post);
    }
    catch {}

    if (window.location.pathname === "/") {
        load_posts(counter);
    }

    document.querySelector('#all_posts, #profile_posts').addEventListener('click', (event) => {
        if (event.target.matches('#edit_button')) {
            const post = event.target.dataset.id 
            const div_id = event.target.parentElement.id

            edit_post(post, div_id);
        }
        else if (event.target.matches('#save_edit')) {

        }
        else if (event.target.matches('#cancel_edit')) {
            
        }
        else if (event.target.matches('#delete_edit')) {
            
        }
    })

    document.querySelector('#previous').addEventListener('click', () => {
        if (counter > 5) {
            counter -= 5;
            load_posts(counter);
        }
    })
    document.querySelector('#next').addEventListener('click', () => {
        counter += 5;
        load_posts(counter);
    })
})

function load_posts(value) {

    const user = document.querySelector('#user_tag').dataset.user
    const all_posts = document.querySelector('#all_posts');

    all_posts.innerHTML = "";

    fetch('/posts?start=' + value, {
        method: "GET",
    })
    .then(response => response.json())
    .then(data => {

        if (data.length === 0) {
            counter = value - 5
            load_posts(counter);
            alert("No more posts");
            return;
        }

        for (i = 0; i < data.length; i++) {

            const existingPost = document.createElement('div');
            existingPost.id = 'post' + i;
            existingPost.className = 'posts';

            const id = data[i].post
            const text = data[i].text
            const username = data[i].user__username
            const likes = data[i].likes
            const comments = data[i].comments
            const upload_time = data[i].upload_time

            existingPost.innerHTML = 
            `<a id="user_heading" href="/profile/${user}">${username}:</a>
            <br>
            <p id="post_text">${text}</p>
            <p id="timestamp">${upload_time}</p>
            <i class="fa fa-solid fa-heart" style="color: #ff0000;"></i>&nbsp 0
            <p>Comment</p>   
            `;

            if (username == user) {
                existingPost.innerHTML += `<button id="edit_button" data-id="${id}">Edit</button>`
            }

            if (likes !== null) {
                existingPost.innerHTML += `<p>${likes}</p>`
            }
            if (comments !== null) {
                existingPost.innerHTML += `<p>${comments}</p>`
            }

            all_posts.append(existingPost);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function load_new_post(event) {

    const user = document.querySelector('#user_tag').dataset.user
    const button = event.target

    button.style.display = 'none'

    const existing = document.querySelector('#new_post')

    const newPost = document.createElement('div')
    newPost.id = 'new_post_item'

    fetch('/get-csrf-token')
    .then(response => response.json())
    .then(data => {

        newPost.innerHTML = 
        `<form action="/posts" method="post">
            <input type="hidden" name="csrfmiddlewaretoken" value="${data.csrf_token}">
            <h2>New Post</h2>
            <input type="text" disabled value="${user}" name="user" id="user_input"><br>
            <textarea placeholder="Text" name="text" id="text_input"></textarea><br>
            <button type="submit">Submit</button>
            <button type="button" id="cancel">Cancel</button>
        </form>`;

        existing.append(newPost);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function cancel_new_post() {

    document.querySelector('#new_post_item').remove();
    document.querySelector('#new_post_button').style.display = 'block';
}

function edit_post(id, div_id) {

    const user = document.querySelector('#user_tag').dataset.user
    const post_div = document.querySelector('#' + div_id)

    fetch('/edit?post=' + id, {
        method: "GET",
    })
    .then(response => response.json())
    .then(data => 

        post_div.innerHTML =
        `<form action="/edit" method="post">
            <h2>Edit</h2>
            <input type="text" disabled value="${user}" name="user" id="user_input"><br>
            <textarea placeholder="Text" name="text" id="edit_text_input">${data.text}</textarea><br>
            <button type="submit" id="save_edit">Save</button>
            <button type="button" id="cancel_edit">Cancel</button>
            <button type="button" id="delete_edit">Delete</button>
        </form>`
    )
}