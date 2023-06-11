
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
        const post = event.target.dataset.id;
        const div_id = event.target.parentElement.id;

        if (event.target.matches('#edit_button')) {
            edit_post(post, div_id);
        }
        else if (event.target.matches('#save_edit')) {
            save_edit(post, div_id);
        }
        else if (event.target.matches('#cancel_edit')) {
            location.reload();
        }
        else if (event.target.matches('#delete_edit')) {
            delete_post(post);
        }
        else if (event.target.matches('#unfollow_button')) {
            const user_uf = event.target.dataset.userid;
            unfollow(user_uf);
        }
        else if (event.target.matches('#follow_button')) {
            const user_f = event.target.dataset.userid;
            follow(user_f);
        }
        else if (event.target.matches('#like_button') || event.target.parentElement.matches('#like_button')) {
            if (event.target.matches('#like_button')) {
                const post = event.target.dataset.postid;
                like_post(post);
            } 
            else {
                const post = event.target.parentElement.dataset.postid;
                like_post(post);
            }
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

    const user = document.querySelector('#user_tag').dataset.user;
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
            `<a id="user_heading" href="/profile/${username}">${username}:</a>
            <br>
            <p id="post_text">${text}</p>
            <p id="timestamp">${upload_time}</p>
            <p>Comment</p>   
            `;

            fetch('/auth',{
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                if (data === true) {
                    if (likes >= 1) {
                        existingPost.innerHTML += `<button id="like_button" data-postid="${id}"><i class="fa fa-solid fa-heart" style="color: #ff0000;"></i>&nbsp <span id="like_count">${likes}</span></button>`
                    }
                    else {
                        existingPost.innerHTML += `<button id="like_button" data-postid="${id}"><i class="fa fa-solid fa-heart" style="color: #ff0000;"></i>&nbsp <span id="like_count">0</span></button>`
                    }

                    fetch('/like/' + id,{
                        method: 'GET'
                    })
                    .then(response => response.json())
                    .then(data => {
                        const like_button = document.querySelector('#like_button[data-postid="' + id + '"]');

                        if (data === true) {
                            like_button.dataset.clicked = 'true';
                        }
                        else if (data === false) {
                            like_button.dataset.clicked = 'false';
                        }
                    })
                }
            })
    
            if (username == user) {
                existingPost.innerHTML += `<button id="edit_button" data-id="${id}">Edit</button>&nbsp`
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
            <textarea placeholder="Text" name="text" id="text_input" required></textarea><br>
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

    fetch('/edit/' + id, {
        method: "GET",
    })
    .then(response => response.json())
    .then(data => 

        post_div.innerHTML =
        `<h2>Edit</h2>
        <input type="text" disabled value="${user}" name="user" id="user_input"><br>
        <textarea placeholder="Text" name="text" id="edit_text_input">${data.text}</textarea><br>
        <button type="submit" id="save_edit" data-id="${id}">Save</button>
        <button type="button" id="cancel_edit">Cancel</button>
        <button type="button" id="delete_edit" data-id="${id}">Delete</button>`
    )
}

function save_edit(id) {

    const new_text = document.querySelector('#edit_text_input').value
    console.log(new_text)
    console.log(id)

    fetch('/edit/' + id, {
        method: "PUT",
        body: JSON.stringify ({
            text: new_text
        })
    })
    .then(response =>
        location.reload()
    )
    .catch(error => {
        console.error('Error:', error);
    });

}

function delete_post(id) {
    
    if (confirm("Are you sure you want to proceed?")){
        fetch('/edit/' + id, {
            method: "DELETE"
        })
        .then(response => {
            location.reload()
        })
    }
    else {
        location.reload()
    }
}

function unfollow(user_uf) {

    if (confirm("Are you sure you want to unfollow this user?")){
        fetch('/unfollow/' + user_uf, {
            method: "DELETE"
        })
        .then(response => {
            location.reload()
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    else {
        location.reload()
    }
}

function follow(user_f) {

    if (confirm("Are you sure you want to follow this user?")){
        fetch('/follow/' + user_f, {
            method: "POST"
        })
        .then(response => {
            location.reload()
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    else {
        location.reload()
    }
}

function like_post(post) {

    const like_count = document.querySelector('#like_button[data-postid="' + post + '"] span');
    const like_button = document.querySelector('#like_button[data-postid="' + post + '"]');
    const likes = parseInt(like_count.innerHTML)
    
    if (like_button.dataset.clicked == 'false') {
        fetch('/like/' + post, {
            method: "POST",         
        })
        .then(response => {
            like_count.innerHTML = likes + 1;
            like_button.dataset.clicked = 'true';
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    else if (like_button.dataset.clicked == 'true') {
        fetch('/like/' + post, {
            method: "PUT",         
        })
        .then(response => {
            like_count.innerHTML = likes - 1;
            like_button.dataset.clicked = 'false';
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}