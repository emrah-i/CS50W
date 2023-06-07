
document.addEventListener("DOMContentLoaded", () => {

    document.querySelector('#new_post_button').addEventListener('click', load_new_post);

    load_posts
})

function load_posts() {

    const all_posts = document.querySelector('#all_posts')

    fetch('/posts')
    .then(response => response.json())
    .then(data => {
        console.log(data);

        for (i = 0; i < data.length; i++) {

            const existingPost = document.createElement('div');
            existingPost.id = 'post' + i;
            existingPost.class = 'posts';
            existingPost.innerHTML = 'g';

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
        `<form action="/post" method="post">
            <input type="hidden" name="csrfmiddlewaretoken" value="${data.csrf_token}">
            <h2>New Post</h2>
            <input type="text" disabled value="${user}" name="user">
            <input type="text" placeholder="Text" name="text">
            <button type="submit">Submit</button>
        </form>`;

        existing.append(newPost);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}