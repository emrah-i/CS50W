
let post_counter = 0
let following_counter = 0
let category_counter = 0
let sort = ''

CATEGORY_CHOICES = [
    {'code': 'general', 'display': 'General Discussion'},
    {'code': 'help', 'display': 'Help and Support'},
    {'code': 'suggestions', 'display': 'Suggestions and Feedback'},
    {'code': 'introductions', 'display': 'Introductions'},
    {'code': 'offtopic', 'display': 'Off-Topic Discussion'},
    {'code': 'news', 'display': 'News and Announcements'},
    {'code': 'technology', 'display': 'Technology and Gadgets'},
    {'code': 'entertainment', 'display': 'Entertainment and Media'},
    {'code': 'sports', 'display': 'Sports and Fitness'},
    {'code': 'education', 'display': 'Education and Learning'},
    {'code': 'arts', 'display': 'Arts and Creativity'},
    {'code': 'food', 'display': 'Food and Cooking'},
    {'code': 'travel', 'display': 'Travel and Adventure'},
    {'code': 'music', 'display': 'Music and Audio'},
    {'code': 'movies', 'display': 'Movies and TV Shows'},
    {'code': 'books', 'display': 'Books and Literature'},
    {'code': 'fashion', 'display': 'Fashion and Style'},
    {'code': 'health', 'display': 'Health and Wellness'},
    {'code': 'politics', 'display': 'Politics and Current Events'},
    {'code': 'business', 'display': 'Business and Entrepreneurship'},
]

document.addEventListener("DOMContentLoaded", () => {

    try {
        document.querySelector('#layout_user_tag').addEventListener('click', (event) => {
            username = event.target.dataset.username
            sort = localStorage.getItem('sort')
    
            window.location = '/profile/' + username + '?sort=' + sort
        })
    }
    catch{}


    try {

        const sort_select = document.querySelector('#sort')

        if (localStorage.getItem('sort') !== null && !window.location.pathname.startsWith('/profile/')) {
            sort_select.value = localStorage.getItem('sort')
        }
        
        sort = sort_select.value
    
        document.querySelector('#sort').addEventListener('change', (element) => {
            const change_sort = element.target.value
            localStorage.setItem('sort', change_sort)
            location.reload()
        })

        if (localStorage.getItem('item_effects_choice') !== null) {
            document.querySelector("#item_effects").innerHTML = localStorage.getItem('item_effects_choice')
        }
    }
    catch {}

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

        if (localStorage.getItem('sort') === null) {
            localStorage.setItem('sort', 'new_old')
        }
        post_counter = 0
        load_posts(post_counter, sort);
    
        document.querySelector('#previous').addEventListener('click', (event) => {
            const button = event.target.id;
            
            if (post_counter >= 5) {
                post_counter -= 5;
                load_posts(post_counter, sort, button);
            }
        })

        document.querySelector('#previous_2').addEventListener('click', (event) => {
            const button = event.target.id;

            if (post_counter >= 10) {
                post_counter -= 10;
                load_posts(post_counter, sort, button);
            }
        })

        document.querySelector('#next').addEventListener('click', (event) => {
            const button = event.target.id

            post_counter += 5;
            load_posts(post_counter, sort, button);
        })

        document.querySelector('#next_2').addEventListener('click', (event) => {
            const button = event.target.id

            post_counter += 10;
            load_posts(post_counter, sort, button);
        })

        try {
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
    catch {}
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

        document.querySelector('#edit_profile_button').addEventListener('click', (event) => {
            window.location = "/edit_profile"
        })
    }

    if (window.location.pathname.startsWith("/post/")) {

        clickCounter = 0

        const url = window.location.pathname
        const id = url.split('/').pop()

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

        try {document.querySelector('#pp_edit_button').addEventListener('click', (event) => {
            const postid = event.target.dataset.id;

            post_page_edit(postid);
        })
        }
        catch{}

        document.querySelectorAll('.post_comments').forEach((element) => {
            const replyButton = element.querySelector('#reply_button');
            const deleteButton = element.querySelector('#delete_comment');
            const editButton = element.querySelector('#edit_comment');
            let userButton = element.querySelector('#user_page_route');

            if (replyButton) {
                replyButton.addEventListener('click', (event) => {
                comment_reply(event);

                let cancelButton = document.querySelector('#cancel_reply');

                cancelButton.addEventListener('click', () => {
                    if (confirm('Are you sure you would like to cancel?')) {
                        location.reload();
                    }
                    });

                let userButton = element.querySelector('#user_page_route');

                userButton.addEventListener('click', (event) => {
                    username = event.target.dataset.username
                    sort = localStorage.getItem('sort')
        
                    window.location = '/profile/' + username + '?sort=' + sort
                    });
            });
            }

            if (userButton) {
                userButton.addEventListener('click', (event) => {
                    username = event.target.dataset.username
                    sort = localStorage.getItem('sort')
        
                    window.location = '/profile/' + username + '?sort=' + sort
                });
            }

            if (deleteButton) {
                deleteButton.addEventListener('click', (event) => {
                if (confirm('Are you sure you would like to delete this reply?')) {
                    delete_comment(event);
                }
                });
            }

            if (editButton) {
                editButton.addEventListener('click', (event) => {
                    comment_id = event.target.dataset.commentid;
                    edit_comment(comment_id);

                    setTimeout(() => {
                        const submitButton = element.querySelector('#submit_comment_edit');
                        const cancelButton = element.querySelector('#cancel_reply');
                  
                        cancelButton.addEventListener('click', () => {
                            if (confirm('Are you sure you would like to cancel?')) {
                                location.reload();
                            }
                        });

                  
                        submitButton.addEventListener('click', () => {

                            new_text = element.querySelector('#comment_text')

                            submit_comment_edit(comment_id, new_text);
                        });
                        
                      }, 50);
                });
            }
        });
    }

    if (window.location.pathname.startsWith("/category/")) {

        const category = document.querySelector('#category_header').dataset.category
        start = category_counter

        document.querySelector('#load_more_button').addEventListener('click', (event) => {
            category_counter += 5
            new_start = category_counter 

            load_category_posts(category, new_start, sort);
        })

        load_category_posts(category, start, sort);

        document.querySelector('#item_effects').addEventListener('change', (event) => {
            if (event.target.value === "on") {
                document.querySelector('#filters').dataset.effects = 'True';
                document.querySelectorAll('.category_post').forEach((element) => {
                    element.dataset.effects = 'True';
                })
                
                const effects_choice = '<option value="off">Off</option><option selected value="on">On</option>'
                event.target.innerHTML = effects_choice                 

                localStorage.setItem('item_effects_choice', effects_choice)
            }
            else {
                document.querySelector('#filters').dataset.effects = 'False';
                document.querySelectorAll('.category_post').forEach((element) => {
                    element.dataset.effects = 'False';
                })

                const effects_choice = '<option selected value="off">Off</option><option value="on">On</option>'
                event.target.innerHTML = effects_choice

                localStorage.setItem('item_effects_choice', effects_choice)
            }
        })
    }

    try {
        document.querySelector('#all_posts, #profile_posts, #following_posts, .post_page, #category_posts').addEventListener('click', (event) => {
            let post = ''
            let div_id = ''
            
            try {
            post = event.target.dataset.id;
            div_id = event.target.parentElement.id;
            }
            catch {}

            if (event.target.matches('#edit_button')) {
                edit_post(post, div_id);
            }
            else if (event.target.matches('#save_edit')) {
                if (document.querySelector('#edit_text_input').value === '') {
                    alert('Must enter text')
                    return
                }
                else if (document.querySelector('#edit_title_input').value === '') {
                    alert('Must enter title')
                    return
                }
                
                save_edit(post)
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
            else if (event.target.matches('#like_button') || event.target.closest('#like_button')) {
                if (event.target.matches('#like_button')) {
                    const post = event.target.dataset.postid;
                    like_post(post);
                } 
                else {
                    const post = event.target.parentElement.dataset.postid;
                    like_post(post);
                }
            }
            else if (event.target.matches('#gtp_button')) {
                const postid =event.target.dataset.postid
                window.location = `/post/${postid}`
            }
        })
    }
    catch{}
})

async function load_posts(value, sort, button) {

    user = ''

    try {
        user = document.querySelector('#layout_user_tag').dataset.username;
    }
    catch {}

    const all_posts = document.querySelector('#all_posts');
    const effects = document.querySelector('#item_effects').value

    all_posts.innerHTML = "";

    const response = await fetch(`/posts?start=${value}&sort=${sort}`);
    const data = await response.json();

    if (data.length === 0 && button === 'next') {
        post_counter = value - 5
        load_posts(post_counter, sort);
        alert("No more posts");
        return;
    }
    else if (data.length === 0 && button === 'next_2') {
        post_counter = value - 10
        load_posts(post_counter, sort);
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
        let text = data[i].text
        if (text.length > 150) {
            text = text.slice(0, 150) + '<span style="font-style: italic; color: lightGray;">...(read more)</span>'
        }
        const username = data[i].user__username
        const like_count = data[i].like_count
        const comments = data[i].comment_count
        const upload_time = data[i].upload_time

        category = data[i].category
        for (j = 0; j < CATEGORY_CHOICES.length; j++) {
            if (CATEGORY_CHOICES[j].code === category) {
                category = CATEGORY_CHOICES[j].display
            }
        }

        existingPost.innerHTML = `
        <div id="post_text_block">
            <p id="post_category">${category}</p>
            <h5 id="post_title">${title}</h5>
            <p id="post_text">${text}</p>
        </div>
        <div id="post_user_block">
            <p id="timestamp">${upload_time}</p>
            <p>Posted by <a id="user_heading" href="/profile/${username}?sort=${sort}">${username}:</a></p>
        </div>
        <div id="post_info_block">
            <p>${comments} Comments</p>   
        </div>
        `;

        buttonsBlock = document.createElement('div')
        buttonsBlock.id = 'post_button_block'
        buttonsBlock.innerHTML = `<button type="button" id="gtp_button" data-postid=${id}>Go To Post</button>`
        existingPost.appendChild(buttonsBlock);

        if (user !== '') {
            const authResponse = await fetch('/auth', {
                method: 'GET',
                });
            const data = await authResponse.json();
            if (data === true) {

                const likeButton = document.createElement('button');
                likeButton.id = 'like_button';
                likeButton.dataset.postid = id;

                if (like_count >= 1) {
                    likeButton.innerHTML = `<i class="fa fa-solid fa-heart" style="color: #ff0000;"></i>&nbsp <span id="like_count">${like_count}</span>`;
                    buttonsBlock.appendChild(likeButton);
                }
                else {
                    likeButton.innerHTML = '<i class="fa fa-solid fa-heart" style="color: #ff0000;"></i>&nbsp <span id="like_count">0</span>';
                    buttonsBlock.appendChild(likeButton);
                }

                const likeResponse = await fetch('/like/' + id, {
                    method: 'GET',
                    });
                const likeData = await likeResponse.json();

                    if (likeData === true) {
                        likeButton.dataset.clicked = 'true';
                    }
                    else if (likeData === false) {
                        likeButton.dataset.clicked = 'false';
                    }
            }

            if (username == user) {
                const editButton = document.createElement('button');
                editButton.id = 'edit_button';
                editButton.dataset.postid = id;
                editButton.innerHTML = 'Edit'
                buttonsBlock.appendChild(editButton);

            }

            all_posts.append(existingPost);
        };
    }
}   


async function load_following_posts(start, sort) {
    
    const main_div = document.querySelector('#following_posts');
    const effects = document.querySelector('#item_effects').value;

    const response = await fetch(`/following_posts/${start}/${sort}`, {
        method: "GET"
    });
    const data = await response.json()
        
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
            let text = data[i].text
            if (text.length > 150) {
                text = text.slice(0, 150) + '<span style="font-style: italic; color: lightGray;">...(read more)</span>'
            }
            const username = data[i].user__username
            const like_count = data[i].like_count
            const comments = data[i].comment_count
            const upload_time = data[i].upload_time

            category = data[i].category
            for (j = 0; j < CATEGORY_CHOICES.length; j++) {
                if (CATEGORY_CHOICES[j].code === category) {
                    category = CATEGORY_CHOICES[j].display
                }
            }

            followingPost.innerHTML = 
            `
            <div id="post_text_block">
                <p id="post_category">${category}</p>
                <h5 id="post_title">${title}</h5>
                <p id="post_text">${text}</p>
            </div>
            <div id="post_user_block">
                <p id="timestamp">${upload_time}</p>
                <p>Posted by <a id="user_heading" href="/profile/${username}?sort=${sort}">${username}:</a></p>
            </div>
            <div id="post_info_block">
                <p>${comments} Comments</p>   
            </div>
            `;

            buttonsBlock = document.createElement('div')
            buttonsBlock.id = 'post_button_block'
            buttonsBlock.innerHTML = `<button type="button" id="gtp_button" data-postid=${id}>Go To Post</button>`
            followingPost.appendChild(buttonsBlock);

            const authResponse = await fetch('/auth',{
                method: 'GET'
            })
            const authData = await authResponse.json()
            if (authData === true) {
        
                const likeButton = document.createElement('button');
                likeButton.id = 'like_button';
                likeButton.dataset.postid = id;

                if (like_count >= 1) {
                    likeButton.innerHTML = `<i class="fa fa-solid fa-heart" style="color: #ff0000;"></i>&nbsp <span id="like_count">${like_count}</span>`;
                    buttonsBlock.appendChild(likeButton);
                }
                else {
                    likeButton.innerHTML = '<i class="fa fa-solid fa-heart" style="color: #ff0000;"></i>&nbsp <span id="like_count">0</span>';
                    buttonsBlock.appendChild(likeButton);
                }

                const likeResponse = await fetch('/like/' + id, {
                    method: 'GET',
                    });
                const likeData = await likeResponse.json();

                if (likeData === true) {
                    likeButton.dataset.clicked = 'true';
                }
                else if (likeData === false) {
                    likeButton.dataset.clicked = 'false';
                }
            }

        main_div.append(followingPost);
    };
}

async function load_category_posts(category, start, sort) {

    const main_div = document.querySelector('#category_posts');
    const user = document.querySelector('#layout_user_tag').dataset.username;
    const effects = document.querySelector('#item_effects').value;

    const response = await fetch(`/category_posts/${category}/${start}/${sort}`, {
        method: "GET"
    })
    const data = await response.json()

    if (data.length === 0) {
        alert("No more posts");
        return;
    }
    
    for(i = 0; i < data.length; i++){

        const categoryPost = document.createElement('div');
        categoryPost.id = 'category_post' + i;
        categoryPost.className = 'category_post';

        if (effects === 'on') {
            categoryPost.dataset.effects = 'True';
        }
        else {
            categoryPost.dataset.effects = 'False';
        }

        const id = data[i].post
        const title = data[i].title
        let text = data[i].text
        if (text.length > 150) {
            text = text.slice(0, 150) + '<span style="font-style: italic; color: lightGray;">...(read more)</span>'
        }
        const username = data[i].user__username
        const like_count = data[i].like_count
        const comments = data[i].comment_count
        const upload_time = data[i].upload_time

        categoryPost.innerHTML = 
        `
        <div id="post_text_block">
            <h5 id="post_title">${title}</h5>
            <p id="post_text">${text}</p>
        </div>
        <div id="post_user_block">
            <p id="timestamp">${upload_time}</p>
            <p>Posted by <a id="user_heading" href="/profile/${username}?sort=${sort}">${username}:</a></p>
        </div>
        <div id="post_info_block">
            <p>${comments} Comments</p>   
        </div>
        `;

        buttonsBlock = document.createElement('div')
        buttonsBlock.id = 'post_button_block'
        buttonsBlock.innerHTML = `<button type="button" id="gtp_button" data-postid=${id}>Go To Post</button>`
        categoryPost.appendChild(buttonsBlock);

        const authResponse = await fetch('/auth',{
            method: 'GET'
        })
        const authData = await authResponse.json()
        if (authData === true) {
    
            const likeButton = document.createElement('button');
            likeButton.id = 'like_button';
            likeButton.dataset.postid = id;

            if (like_count >= 1) {
                likeButton.innerHTML = `<i class="fa fa-solid fa-heart" style="color: #ff0000;"></i>&nbsp <span id="like_count">${like_count}</span>`;
                buttonsBlock.appendChild(likeButton);
            }
            else {
                likeButton.innerHTML = '<i class="fa fa-solid fa-heart" style="color: #ff0000;"></i>&nbsp <span id="like_count">0</span>';
                buttonsBlock.appendChild(likeButton);
            }

            const likeResponse = await fetch('/like/' + id, {
                method: 'GET',
                });
            const likeData = await likeResponse.json();

            if (likeData === true) {
                likeButton.dataset.clicked = 'true';
            }
            else if (likeData === false) {
                likeButton.dataset.clicked = 'false';
            }

            if (username == user) {
                const editButton = document.createElement('button');
                editButton.id = 'edit_button';
                editButton.dataset.postid = id;
                editButton.innerHTML = 'Edit'
                buttonsBlock.appendChild(editButton);

            }
        }

    main_div.append(categoryPost);
};
}


function load_new_post(event) {

    const user = document.querySelector('#layout_user_tag').dataset.username
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
            <input required type="text" name="title" id="title_input" placeholder="Enter Title" name="title"><br>
            <textarea required placeholder="Text" name="text" id="text_input"></textarea><br>
            <select required name="category" id="category_input">
                <option selected disabled>Select Category</option>
                ${CATEGORY_CHOICES.map(choice => `<option value=${choice.code}>${choice.display}</option>`).join('')}
            </select>
            <br>
            <div id="new_post_buttons">
                <button type="submit">Submit</button>
                <button type="button" id="cancel">Cancel</button>
            </div>
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

    const user = document.querySelector('#layout_user_tag').dataset.username
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
            <select>
                <option value="${data.category}" selected>${data.category_display}</option>
                ${CATEGORY_CHOICES.map(choice => `<option value=${choice.code}>${choice.display}</option>`).join('')}
            </select>
            <br><br>
            <button type="button" id="save_edit" data-id="${id}">Save</button>
            <button type="button" id="cancel_edit">Cancel</button>
            <button type="button" id="delete_edit" data-id="${id}">Delete</button>
        </form>`
    )
}

function post_page_edit(postid) {

    const user = document.querySelector('#layout_user_tag').dataset.username
    const title = document.querySelector('#pp_title')
    document.querySelector('#pp_text').style.display = 'none'
    document.querySelector('#pp_ut').style.display = 'none'
    document.querySelector('#pp_category').style.display = 'none'
    document.querySelector('#like_button').style.display = 'none'
    document.querySelector('#pp_edit_button').style.display = 'none'

    fetch('/edit/' + postid, {
        method: "GET",
    })
    .then(response => response.json())
    .then(data => 

        title.innerHTML =
        `<h2>Edit</h2>
        <form>
            <input type="text" disabled value="${user}" name="user" id="user_input"><br>
            <select id="edit_category_input">
                <option value="${data.category}" selected>${data.category_display}</option>
                ${CATEGORY_CHOICES.map(choice => `<option value=${choice.code}>${choice.display}</option>`).join('')}
            </select><br>
            <input required type="text" name="title" id="edit_title_input" placeholder="Enter Title" value="${data.title}"><br>
            <textarea required placeholder="Text" name="text" id="edit_text_input">${data.text}</textarea><br>
            <button type="button" id="save_edit" data-id="${postid}">Save</button>
            <button type="button" id="cancel_edit">Cancel</button>
            <button type="button" id="delete_edit" data-id="${postid}">Delete</button>
            <hr>
        </form>`
    )
}

function save_edit(id) {

    const new_text = document.querySelector('#edit_text_input')
    const new_title = document.querySelector('#edit_title_input')
    const new_category = document.querySelector('#edit_category_input')

    fetch('/edit/' + id, {
        method: "PUT",
        body: JSON.stringify ({
            text: new_text.value + ' (edited)',
            title: new_title.value + ' (edited)',
            category: new_category.value
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
            if (window.location.pathname === '/' || window.location.pathname.startsWith('/profile/')) {
                location.reload()
            }
            else if (window.location.pathname.startsWith('/post/')) {
                window.location = `/`
            }
        })
    }
    else {
        location.reload()
    }
}

function profile(username, start) {

    user = ''
    try {
        user = document.querySelector('#layout_user_tag').dataset.username;
    }
    catch {}

    innerHTML = `<div class="profile_post" id='profile_post{{ forloop.counter }}'>
    <p>{{ post.text }}</p>
    <p>{{ post.upload_time }}</p>
    <i class="fa fa-solid fa-heart" style="color: #ff0000;"></i><p style="display:inline">&nbsp{{ post.likes_count }}</p>
    <p>{{ post.comments_count }} Comments</p>
    <button id="edit_button" data-id="{{ post.post }}">Edit</button>
    </div>`

    if (user !== '') {
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
}}

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

function comment_reply(event) {

    const post = document.querySelector('.post_page').dataset.postid
    const commentid = event.target.dataset.commentid;
    const main_div = '#comment' + commentid
    const user = document.querySelector('#layout_user_tag').dataset.username;
    document.querySelector(main_div + ' #delete_comment').style.display = 'none';
    document.querySelector(main_div + ' #edit_comment').style.display = 'none';
    event.target.style.display = 'none';

    event.target.parentElement.innerHTML += `
    <form action="/reply/${commentid}" method="post" id="reply_form">
        <input hidden value=${post} name="postid">
        <input disabled value="${user}" id="user_input">
        <textarea id="comment_text" name="reply_text" placeholder="Enter Comment" required maxlength="250"></textarea><br>
        <button type="submit">Reply</button>
        <button type="button" id="cancel_reply">Cancel</button>
    </form>
    `
}

function delete_comment(event) {
    
    const id = event.target.dataset.commentid;
    console.log(id)
    
    fetch('/comment/' + id, {
        method: "PUT",
        body: JSON.stringify ({
            text: '[DELETED]'
        })
    })
    .then(response =>
        location.reload()
    )
    .catch(error => {
        console.error('Error:', error);
    });
}

function edit_comment(comment_id) {

    const main = '#comment' + comment_id
    const main_div = document.querySelector(main);
    const user = document.querySelector('#layout_user_tag').dataset.username;
    document.querySelector(main + ' #delete_comment').style.display = 'none';
    document.querySelector(main + ' #edit_comment').style.display = 'none';
    document.querySelector(main + ' #reply_button').style.display = 'none';

    fetch('/edit_comment/' + comment_id, {
        method: "GET"
    })
    .then(response => response.json())
    .then(data => {
        
        text = data['text']

        if (text !== '[DELETED]') {
            main_div.innerHTML += `
            <form id="comment_edit_form">
                <input disabled value="${user}" id="user_input">
                <textarea id="comment_text" name="edited_comment_text" placeholder="Enter Comment" required maxlength="250">${text}</textarea><br>
                <button type="button" id="submit_comment_edit">Post</button>
                <button type="button" id="cancel_reply">Cancel</button>
            </form>
            `
        }
        else {
            alert('You cannot edit a deleted comment!')
            location.reload()
        }
    })
}

function submit_comment_edit(comment_id, new_text) {

    console.log(new_text.value)

    fetch('/edit_comment/' + comment_id, {
        method: 'PUT',
        body: JSON.stringify ({
            text: new_text + ' (edited)',
        })
    })
    .then(response => {
        location.reload()
    })
    .catch(error => {
        console.error('Error:', error);
    });
}