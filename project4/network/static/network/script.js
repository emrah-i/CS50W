
let post_counter = 0
let following_counter = 0

document.addEventListener("DOMContentLoaded", () => {

    const sort_select = document.querySelector('#sort')
    if (localStorage.getItem('sort') !== null && !window.location.pathname.startsWith('/profile/')) {
        sort_select.value = localStorage.getItem('sort')
    }
    const sort = sort_select.value

    document.querySelector('#sort').addEventListener('change', (element) => {
        const change_sort = element.target.value
        localStorage.setItem('sort', change_sort)
        location.reload()
    })

    if(localStorage.getItem('item_effects_choice') !== null) {
        document.querySelector("#item_effects").innerHTML = localStorage.getItem('item_effects_choice')
    }

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
        load_posts(post_counter, sort);
    
        document.querySelector('#previous').addEventListener('click', () => {
            if (post_counter >= 5) {
                post_counter -= 5;
                load_posts(post_counter, sort);
            }
        })
        document.querySelector('#next').addEventListener('click', () => {
            post_counter += 5;
            load_posts(post_counter, sort);
        })

        if (document.querySelector('#item_effects').value === 'on') {
            document.querySelector('#new_post').dataset.effects = 'True'
            document.querySelector('#filters').dataset.effects = 'True'
        }
        else if (document.querySelector('#item_effects').value === 'off') {
            document.querySelector('#new_post').dataset.effects = 'False'
            document.querySelector('#filters').dataset.effects = 'False'
        }

        document.querySelector('#item_effects').addEventListener('change', (event) => {
            if (event.target.value === "on") {
                document.querySelector('#new_post').dataset.effects = 'True'
                document.querySelector('#filters').dataset.effects = 'True'
                document.querySelectorAll('.posts').forEach((element) => {
                    element.dataset.effects = 'True'
                })
                const effects_choice = '<option value="off">Off</option><option selected value="on">On</option>'
                event.target.innerHTML = effects_choice                 

                localStorage.setItem('item_effects_choice', effects_choice)
            }
            else {
                document.querySelector('#new_post').dataset.effects = 'False'
                document.querySelector('#filters').dataset.effects = 'False'
                document.querySelectorAll('.posts').forEach((element) => {
                    element.dataset.effects = 'False'
                })

                const effects_choice = '<option selected value="off">Off</option><option value="on">On</option>'
                event.target.innerHTML = effects_choice

                localStorage.setItem('item_effects_choice', effects_choice)
            }
        });
    }

    if (window.location.pathname === "/following") {
        load_following_posts(following_counter, sort);

        window.addEventListener('scroll', () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                following_counter += 4;
                load_following_posts(following_counter, sort);
        }})

        if (document.querySelector('#item_effects').value === 'on') {
            document.querySelector('#filters').dataset.effects = 'True';
            document.querySelectorAll('.following_posts').forEach((element) => {
                element.dataset.effects = 'True';
            })
        }
        else if (document.querySelector('#item_effects').value === 'off') {
            document.querySelector('#filters').dataset.effects = 'False';
            document.querySelectorAll('.following_posts').forEach((element) => {
                element.dataset.effects = 'False';
            })
        }

        document.querySelector('#item_effects').addEventListener('change', (event) => {
            if (event.target.value === "on") {
                document.querySelector('#filters').dataset.effects = 'True';
                document.querySelectorAll('.following_posts').forEach((element) => {
                    element.dataset.effects = 'True';
                })
                
                const effects_choice = '<option value="off">Off</option><option selected value="on">On</option>'
                event.target.innerHTML = effects_choice                 

                localStorage.setItem('item_effects_choice', effects_choice)
            }
            else {
                document.querySelector('#filters').dataset.effects = 'False';
                document.querySelectorAll('.following_posts').forEach((element) => {
                    element.dataset.effects = 'False';
                })

                const effects_choice = '<option selected value="off">Off</option><option value="on">On</option>'
                event.target.innerHTML = effects_choice

                localStorage.setItem('item_effects_choice', effects_choice)
            }
        })
    }

    if (window.location.pathname.startsWith("/profile/")) {
        document.querySelector('#open_following').addEventListener('click', () => {
            document.querySelector('#following_users_popup dialog').open = true;
            document.querySelector('#followers_user_popup dialog').open = false;
            document.querySelector('#dialog_backdrop').style.display = 'block';
        });
        document.querySelectorAll('#close_following, #dialog_backdrop').forEach(element => {element.addEventListener('click', () => {
            document.querySelector('#following_users_popup dialog').open = false;
            document.querySelector('#dialog_backdrop').style.display = 'none';
            })
        });
        document.querySelector('#open_followers').addEventListener('click', () => {
            document.querySelector('#followers_user_popup dialog').open = true;
            document.querySelector('#following_users_popup dialog').open = false;
            document.querySelector('#dialog_backdrop').style.display = 'block';
        });
        document.querySelectorAll('#close_followers, #dialog_backdrop').forEach(element => {element.addEventListener('click', () => {
            document.querySelector('#followers_user_popup dialog').open = false;
            document.querySelector('#dialog_backdrop').style.display = 'none';
            })
        });

        if (document.querySelector('#item_effects').value === 'on') {
            document.querySelector('#filters').dataset.effects = 'True';
            document.querySelector('#user_info').dataset.effects = 'True'
            document.querySelectorAll('.profile_post').forEach((element) => {
                element.dataset.effects = 'True'
            })
        }
        else if (document.querySelector('#item_effects').value === 'off') {
            document.querySelector('#filters').dataset.effects = 'False';
            document.querySelector('#user_info').dataset.effects = 'False'
            document.querySelectorAll('.profile_post').forEach((element) => {
                element.dataset.effects = 'False'
            })
        }

        document.querySelector('#item_effects').addEventListener('change', (event) => {
            if (event.target.value === "on") {
                document.querySelector('#filters').dataset.effects = 'True';
                document.querySelector('#user_info').dataset.effects = 'True'
                document.querySelectorAll('.profile_post').forEach((element) => {
                    element.dataset.effects = 'True'
                })
                
                const effects_choice = '<option value="off">Off</option><option selected value="on">On</option>'
                event.target.innerHTML = effects_choice                 

                localStorage.setItem('item_effects_choice', effects_choice)
            }
            else {
                document.querySelector('#filters').dataset.effects = 'False';
                document.querySelector('#user_info').dataset.effects = 'False'
                document.querySelectorAll('.profile_post').forEach((element) => {
                    element.dataset.effects = 'False'
                })

                const effects_choice = '<option selected value="off">Off</option><option value="on">On</option>'
                event.target.innerHTML = effects_choice

                localStorage.setItem('item_effects_choice', effects_choice)
            }
        })

        const sort_select = document.querySelector('#sort')
        if (localStorage.getItem('sort') !== null) {
            sort_select.value = localStorage.getItem('sort')
        }

        document.querySelector('#sort').addEventListener('change', (element) => {
            const change_sort = element.target.value
            localStorage.setItem('sort', change_sort)
            var url = new URL(window.location.href);
            url.searchParams.set('sort', change_sort);
            window.location.href = url.href;
        })
    }

    document.querySelector('#all_posts, #profile_posts, #following_posts').addEventListener('click', (event) => {
        const post = event.target.dataset.id;
        const div_id = event.target.parentElement.id;

        if (event.target.matches('#edit_button')) {
            edit_post(post, div_id);
        }
        else if (event.target.matches('#save_edit')) {
            document.querySelector('#save_edit').addEventListener('click', function(event) {
                event.preventDefault();
                save_edit(post, div_id);
              });
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
})

function load_posts(value, sort) {

    const user = document.querySelector('#user_tag').dataset.user;
    const all_posts = document.querySelector('#all_posts');
    const effects = document.querySelector('#item_effects').value

    all_posts.innerHTML = "";

    fetch(`/posts?start=${value}&sort=${sort}`, {
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

            if (effects === 'on') {
                existingPost.dataset.effects = 'True';
            }
            else {
                existingPost.dataset.effects = 'False';
            }

            const id = data[i].post
            const title = data[i].title
            const text = data[i].text
            const username = data[i].user__username
            const likes = data[i].likes
            const comments = data[i].comments
            const upload_time = data[i].upload_time

            existingPost.innerHTML = 
            `<a id="user_heading" href="/profile/${username}?sort=${sort}">${username}:</a>
            <hr>
            <h5 id="post_title">${title}</h5>
            <hr>
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

function load_following_posts(start, sort) {
    
    const main_div = document.querySelector('#following_posts');
    const user = document.querySelector('#user_tag').dataset.user;
    const effects = document.querySelector('#item_effects').value;

    fetch(`/following_posts/${start}/${sort}`, {
        method: "GET"
    })
    .then(reponse => reponse.json())
    .then(data => {
        
        for(i = 0; i < data.length; i++){

            const followingPost = document.createElement('div');
            followingPost.id = 'following_post' + i;
            followingPost.className = 'following_posts';

            if (effects === 'on') {
                followingPost.dataset.effects = 'True';
            }
            else {
                followingPost.dataset.effects = 'False';
            }

            const id = data[i].post
            const title = data[i].title
            const text = data[i].text
            const username = data[i].user__username
            const likes = data[i].likes
            const comments = data[i].comments
            const upload_time = data[i].upload_time

            followingPost.innerHTML = 
            `<a id="user_heading" href="/profile/${username}?sort=${sort}">${username}:</a>
            <hr>
            <h5 id="post_title">${title}</h5>
            <hr>
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
                        followingPost.innerHTML += `<button id="like_button" data-postid="${id}"><i class="fa fa-solid fa-heart" style="color: #ff0000;"></i>&nbsp <span id="like_count">${likes}</span></button>`
                    }
                    else {
                        followingPost.innerHTML += `<button id="like_button" data-postid="${id}"><i class="fa fa-solid fa-heart" style="color: #ff0000;"></i>&nbsp <span id="like_count">0</span></button>`
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
                followingPost.innerHTML += `<button id="edit_button" data-id="${id}">Edit</button>&nbsp`
            }
            if (comments !== null) {
                followingPost.innerHTML += `<p>${comments}</p>`
            }

            main_div.append(followingPost);
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
            <input required type="text" name="title" id="title_input" placeholder="Enter Title"><br>
            <textarea required placeholder="Text" name="text" id="text_input"></textarea><br>
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
        <form>
            <input type="text" disabled value="${user}" name="user" id="user_input"><br>
            <input required type="text" name="title" id="edit_title_input" placeholder="Enter Title" value="${data.title}"><br>
            <textarea required placeholder="Text" name="text" id="edit_text_input">${data.text}</textarea><br>
            <button type="submit" id="save_edit" data-id="${id}">Save</button>
            <button type="button" id="cancel_edit">Cancel</button>
            <button type="button" id="delete_edit" data-id="${id}">Delete</button>
        </form>`
    )
}

function save_edit(id) {

    const new_text = document.querySelector('#edit_text_input')
    const new_title = document.querySelector('#edit_title_input')

    fetch('/edit/' + id, {
        method: "PUT",
        body: JSON.stringify ({
            text: new_text.value,
            title: new_title.value
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

function profile(username, start) {

    innerHTML = `<div class="profile_post" id='profile_post{{ forloop.counter }}'>
    <p>{{ post.text }}</p>
    <p>{{ post.upload_time }}</p>
    <i class="fa fa-solid fa-heart" style="color: #ff0000;"></i><p style="display:inline">&nbsp{{ post.likes_count }}</p>
    <p>{{ post.comments_count }} Comments</p>
    <button id="edit_button" data-id="{{ post.post }}">Edit</button>
    </div>`

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
    }}