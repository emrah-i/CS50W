
document.addEventListener("DOMContentLoaded", () => {

    let counter = 0

    document.querySelector('#new_post_button').addEventListener('click', load_new_post);
    window.onscroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            counter += 5;
            load_posts(counter), 2000
        }
    }

    load_posts(0);
})

function load_posts(value) {

    const all_posts = document.querySelector('#all_posts')

    console.log("hi")

    fetch('/posts?start=' + value, {
        method: "GET",
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);

        for (i = 0; i < data.length; i++) {

            const existingPost = document.createElement('div');
            existingPost.id = 'post' + i;
            existingPost.className = 'posts'

            const text = data[i].text
            const user = data[i].user__username
            const likes = data[i].likes
            const comments = data[i].comments
            const upload_time = data[i].upload_time

            existingPost.innerHTML = 
            `<h6>${user}:<h6>
            <p>${text}</p>
            <p>${upload_time}</p>
            `;

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
        </form>`;

        existing.append(newPost);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}