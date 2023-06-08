
let counter = 0

document.addEventListener("DOMContentLoaded", () => {

    window.onpopstate = function (event) {
        if (event.state && event.state.page) {
            value = (event.state.page - 1) * 5
            load_posts(value);
        } else {
            load_posts(0);
        }
    };

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
    }
})

function load_posts(value) {

    counter = value ;

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
        }

        for (i = 0; i < data.length; i++) {

            const existingPost = document.createElement('div');
            existingPost.id = 'post' + i;
            existingPost.className = 'posts';

            const text = data[i].text
            const user = data[i].user__username
            const likes = data[i].likes
            const comments = data[i].comments
            const upload_time = data[i].upload_time

            existingPost.innerHTML = 
            `<p id="user_heading">${user}:</p>
            <p>"${text}"</p>
            <p id="timestamp">${upload_time}</p>
            <i class="fa fa-solid fa-heart" style="color: #ff0000;"></i> 0
            <p>Comment</p>        
            `;

            if (likes !== null) {
                existingPost.innerHTML += `<p>${likes}</p>`
            }
            if (comments !== null) {
                existingPost.innerHTML += `<p>${comments}</p>`
            }

            all_posts.append(existingPost);

            page = value / 5;
            const url = window.location.pathname + '?page=' + page;
            window.history.pushState({ page }, '', url);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function load_new_post(event) {

    const button = event.target

    button.style.display = 'none'

    const existing = document.querySelector('#new_post')

    const newPost = document.createElement('div')
    newPost.id = 'new_post_item'

    const user = document.querySelector('#new_post_button').dataset.user

    fetch('/get-csrf-token')
    .then(response => response.json())
    .then(data => {
        // Create the form HTML with the retrieved CSRF token
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