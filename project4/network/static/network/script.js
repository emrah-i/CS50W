let post_counter = 0
let following_counter = 0
let category_counter = 0
let search_counter = 0
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

    post_counter = 0
    following_counter = 0
    category_counter = 0
    search_counter = 0

    const dropdowns = document.querySelector('#menu_list');

    dropdowns.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    let dark_mode = document.querySelector('#dark_mode')

    if (localStorage.getItem('dark_mode') !== null) {

        const mode = localStorage.getItem('dark_mode')

        if (mode === 'true') {
            document.querySelector('body').style.backgroundColor = '#212F3D';
            dark_mode.checked = true
        }
        else {
            document.querySelector('body').style.backgroundColor = 'whitesmoke';
            dark_mode.checked = false
        }
    }

    dark_mode.addEventListener('change', () => {

        dark_mode = document.querySelector('#dark_mode')

        localStorage.setItem('dark_mode', dark_mode.checked)

        if (dark_mode.checked === true) {
            document.querySelector('body').style.backgroundColor = '#212F3D';
        }
        else {
            document.querySelector('body').style.backgroundColor = 'whitesmoke';
        }
    })

    const layout_user_tag = document.querySelector('#layout_user_tag')

    if (layout_user_tag){
        layout_user_tag.addEventListener('click', (event) => {
            username = event.target.dataset.username
            sort = localStorage.getItem('sort')
    
            window.location = '/profile/' + username + '?sort=' + sort
        })
    }

    const sort_select = document.querySelector('#sort')

    if (sort_select) {

        if (localStorage.getItem('sort') !== null && !window.location.pathname.startsWith('/profile/')) {
            sort_select.value = localStorage.getItem('sort')
        }
        
        sort = sort_select.value
    
        document.querySelector('#sort').addEventListener('change', (element) => {
            const change_sort = element.target.value
            localStorage.setItem('sort', change_sort)
            location.reload()
        })
    }

    const new_post = document.querySelector('#new_post')

    if (new_post) {
        new_post.addEventListener('click', (event) => {
            if (event.target.matches('#cancel')) {
                cancel_new_post();
            }
        });
        document.querySelector('#new_post_button').addEventListener('click', load_new_post);
    }
   

    if (window.location.pathname === '/search_page') {

        const search_form = document.querySelector('#search_form_submit')
        let query = document.querySelector('#search_query').value
        let sort_new = 'rel'
        const sort_change = document.querySelector('#search_sort')

        document.addEventListener("keydown", (event) => {
            if (event.key === 'Enter') {
                event.preventDefault()
                search()
                }
            })

        search_form.addEventListener('click', () => {
            search();
        })
    
        function search() {
            query = document.querySelector('#search_query').value

            search_counter = 0;

            if (sort_change) {
                sort_new = sort_change.value
            }

            if (query.trim().length !== 0) {
                load_search_results(query, sort_new, search_counter)
            }
            else {
                alert('You must enter a keyword');
                return;
            }
        }
    
        document.querySelector('#load_more_button').addEventListener('click', () => {
            search_counter += 10

            load_search_results(query, sort_new, search_counter);
        })
    }

    if (window.location.pathname === "/") {

        if (localStorage.getItem('sort') === null) {
            localStorage.setItem('sort', 'new_old')
        }
        post_counter = 0
        load_posts(post_counter, sort);
    
        document.querySelector('#previous').addEventListener('click', (event) => {
            const button = event.target.id;
            
            if (post_counter >= 10) {
                post_counter -= 10;
                load_posts(post_counter, sort, button);
            }
        })

        document.querySelector('#previous_2').addEventListener('click', (event) => {
            const button = event.target.id;

            if (post_counter >= 20) {
                post_counter -= 20;
                load_posts(post_counter, sort, button);
            }
        })

        document.querySelector('#next').addEventListener('click', (event) => {
            const button = event.target.id

            post_counter += 10;
            load_posts(post_counter, sort, button);
        })

        document.querySelector('#next_2').addEventListener('click', (event) => {
            const button = event.target.id

            post_counter += 20;
            load_posts(post_counter, sort, button);
        })
    }

    let execution = Date.now();

    if (window.location.pathname === "/following") {

        load_following_posts(following_counter, sort);

        window.addEventListener('scroll', () => {
            if (Date.now() >= execution  && window.innerHeight + window.scrollY >= document.body.offsetHeight) {                
                following_counter += 10;
                execution += 2500;
                load_following_posts(following_counter, sort);
        }})
    }

    if (window.location.pathname.startsWith("/profile/")) {
        document.querySelector('#open_following').addEventListener('click', () => {
            document.querySelector('#following_users_popup').style.display = 'block';
            document.querySelector('#followers_user_popup').style.display = 'none';
            document.querySelector('#dialog_backdrop').style.display = 'block';
        });
        document.querySelectorAll('#close_following, #dialog_backdrop').forEach(element => {element.addEventListener('click', () => {
            document.querySelector('#following_users_popup').style.display = 'none';
            document.querySelector('#dialog_backdrop').style.display = 'none';
            })
        });
        document.querySelector('#open_followers').addEventListener('click', () => {
            document.querySelector('#followers_user_popup').style.display = 'block';
            document.querySelector('#following_users_popup').style.display = 'none';
            document.querySelector('#dialog_backdrop').style.display = 'block';
        });
        document.querySelectorAll('#close_followers, #dialog_backdrop').forEach(element => {element.addEventListener('click', () => {
            document.querySelector('#followers_user_popup').style.display = 'none';
            document.querySelector('#dialog_backdrop').style.display = 'none';
            })
        });

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

        try {
            document.querySelector('#edit_profile_button').addEventListener('click', (event) => {
            window.location = "/edit_profile"
            })
        }
        catch{}
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

        const pp_edit_button = document.querySelector('#pp_edit_button')

        if (pp_edit_button) {
            pp_edit_button.addEventListener('click', (event) => {
            const postid = event.target.dataset.id;

            post_page_edit(postid);
        })
        }

        let userButton = document.querySelector('#user_page_route');

        userButton.addEventListener('click', (event) => {
            username = event.target.dataset.username
            sort = localStorage.getItem('sort')

            window.location = '/profile/' + username + '?sort=' + sort
            });

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
            category_counter += 10
            new_start = category_counter 

            load_category_posts(category, new_start, sort);
        })

        load_category_posts(category, start, sort);

    }

    if (window.location.pathname === "/edit_profile") {
        const imageInput = document.querySelector('#image_input');
        const uploadedImage = document.querySelector('#uploaded_image');
        const imageContainer = document.querySelector('#image_container_new');

        imageInput.addEventListener('change', (event) => {
            const file = event.target.files[0];

            if (file) {
                const reader = new FileReader();

                reader.addEventListener('load', (event) => {
                    imageContainer.style.display = 'block';
                    uploadedImage.src = event.target.result;
                });

                reader.readAsDataURL(file);
            }
            });
    }

    try {
        document.querySelector('body').addEventListener('click', (event) => {
            let post = ''
            let div_id = ''
            
            try {
            post = event.target.dataset.id;
            div_id = event.target.dataset.post;
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
            else if (event.target.matches('#remove_follower_button')) {
                const user_uf = event.target.dataset.userid;
                remove(user_uf);
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
});

async function load_posts(value, sort, button) {

    user = ''

    try {
        user = document.querySelector('#layout_user_tag').dataset.username;
    }
    catch {}

    const all_posts = document.querySelector('.all_posts');

    all_posts.innerHTML = "";

    const response = await fetch(`/posts?start=${value}&sort=${sort}`);
    const data = await response.json();

    if (data.length === 0 && button === 'next') {
        post_counter = value - 10
        load_posts(post_counter, sort);
        alert("No more posts");
        return;
    }
    else if (data.length === 0 && button === 'next_2') {
        post_counter = value - 20
        load_posts(post_counter, sort);
        alert("No more posts");
        return;
    }

    page_count = value / 10 + 1

    document.querySelector('#page_count').innerHTML= `Page: ${page_count}`

    load_items(all_posts, data)
};

async function load_following_posts(start, sort) {
    const main_div = document.querySelector('.following_posts');

    const response = await fetch(`/following_posts/${start}/${sort}`, {
        method: "GET"
    });
    const data = await response.json()

    load_items(main_div, data)
};

async function load_category_posts(category, start, sort) {

    const main_div = document.querySelector('.category_posts');

    const response = await fetch(`/category_posts/${category}/${start}/${sort}`, {
        method: "GET"
    })
    const data = await response.json()

    if (data.length === 0) {
        alert("No more posts");
        return;
    }

    load_items(main_div, data);
};

async function load_search_results(query, sort, start) {

    const main = document.querySelector('.search_posts');
    const heading = document.querySelector('#search_posts_heading');
    const parent = document.querySelector('#search_results');
    const load = document.querySelector('#load_more');
    const heads = document.querySelector('#posts_categories')

    heading.innerHTML = `<h3>Search results for '${query}'<h3>`

    if (start === 0) {
        main.innerHTML = ''
    }

    const response = await fetch(`/search/${query}?sort=${sort}&start=${start}`, {
        method: "GET"
    })
    const data = await response.json()

    console.log(data.length)

    if (data.length === 0 && start === 0) {
        load.style.display = 'none';
        heads.style.display = 'none';
        parent.style.display = 'block';
        heading.style.display = 'block';
        heading.innerHTML = `No posts found with "${query}"`;
        return
    }

    heads.style.display = 'flex';
    load.style.display = 'block';
    parent.style.display = 'block';
    heading.style.display = 'block';

    if (data.length > 0) {
        document.querySelector('#search_posts_heading').innerHTML = `Search results for "${query}"`;
    }

    load_items(main, data)
};  

async function load_items(mainDiv, data) {

    for(i = 0; i < data.length; i++){

        const postDiv = document.createElement('div');
        postDiv.id = 'post' + i;
        postDiv.className = 'row posts';

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
        let unique_users = 'by ' + data[i].unique_users

        if (data[i].unique_users === 1) {
            unique_users += ' user'
        }
        else if (data[i].unique_users === 0) {
            unique_users = ''
        }
        else {
            unique_users += ' users'
        }

        category = data[i].category
        for (j = 0; j < CATEGORY_CHOICES.length; j++) {
            if (CATEGORY_CHOICES[j].code === category) {
                category = CATEGORY_CHOICES[j].display
            }
        }

        postDiv.innerHTML = 
        `<div class='col-12' id="post_text_block">
            <h4 id="post_title">${title}</h4>
            <p id="post_text">${text}</p>
        </div>
        <div class='col-12-xl' id="post_category_block">
            <p id="post_category">${category}</p>
        </div>  
        <div class='col-12-xl' id="post_user_block">
            <p id="timestamp">Posted ${upload_time}</p>
            <p>by <a id="user_heading" href="/profile/${username}?sort=${sort}">${username}</a></p>
        </div>
        <div class='col-12-xl' id="post_info_block">
            <p>${comments} comment(s) ${unique_users}</p>   
        </div>`;

        buttonsBlock = document.createElement('div')
        buttonsBlock.className = 'col-12-xl'
        buttonsBlock.id = `post_button_block`
        buttonsBlock.dataset.id = id
        buttonsBlock.innerHTML = `<button class="btn" type="button" id="gtp_button" data-postid=${id}>Go To Post</button>`
        postDiv.appendChild(buttonsBlock);

        const authResponse = await fetch('/auth',{
            method: 'GET'
        })
        const authData = await authResponse.json()
        if (authData === true) {

            const likeButton = document.createElement('button');
            likeButton.className = 'btn';
            likeButton.id = 'like_button';
            likeButton.dataset.postid = id;

            const likeResponse = await fetch('/like/' + id, {
                method: 'GET',
                });
            const likeData = await likeResponse.json();

                if (likeData === true) {
                    likeButton.dataset.clicked = 'true';
                    likeButton.innerHTML = '<i class="fa fa-solid fa-heart" style="color: #ff0000;"></i>&nbsp<span id="like_count"></span>';
                }
                else if (likeData === false) {
                    likeButton.dataset.clicked = 'false';
                    likeButton.innerHTML = '<i class="fa-regular fa-heart" style="color: #ff0000;"></i>&nbsp<span id="like_count"></span>';
                }

            const likeCount = likeButton.querySelector('#like_count')

            if (like_count >= 1) {
                likeCount.innerText = `${like_count}`;
                buttonsBlock.appendChild(likeButton);
            }
            else {
                likeCount.innerText = '0';
                buttonsBlock.appendChild(likeButton);
            }
        }
    mainDiv.appendChild(postDiv)
    }
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
                <button class="btn" type="submit">Submit</button>
                <button class="btn" type="button" id="cancel">Cancel</button>
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
            <select id="edit_category_input">
                <option value="${data.category}" selected>${data.category_display}</option>
                ${CATEGORY_CHOICES.map(choice => `<option value=${choice.code}>${choice.display}</option>`).join('')}
            </select>
            <br><br>
            <button class="btn" type="button" id="save_edit" data-id="${id}">Save</button>
            <button class="btn" type="button" id="cancel_edit">Cancel</button>
            <button class="btn" type="button" id="delete_edit" data-id="${id}">Delete</button>
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
            <button class="btn" type="button" id="save_edit" data-id="${postid}">Save</button>
            <button class="btn" type="button" id="cancel_edit">Cancel</button>
            <button class="btn" type="button" id="delete_edit" data-id="${postid}">Delete</button>
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

function remove(user_uf) {

    if (confirm("Are you sure you want to remove this user?")){
        fetch('/remove/' + user_uf, {
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
    const like_icon = document.querySelector('#like_button[data-postid="' + post + '"] i');
    const likes = parseInt(like_count.innerHTML)
    
    if (like_button.dataset.clicked == 'false') {
        fetch('/like/' + post, {
            method: "POST",         
        })
        .then(response => {
            like_count.innerHTML = likes + 1;
            like_button.dataset.clicked = 'true';
            like_icon.className = 'fa-solid fa-heart'
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
            like_icon.className = 'fa-regular fa-heart'
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
        <button class="btn" type="submit">Reply</button>
        <button class="btn" type="button" id="cancel_reply">Cancel</button>
    </form>
    `
}

function delete_comment(event) {
    
    const id = event.target.dataset.commentid;
    
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
                <button class="btn" type="button" id="submit_comment_edit">Post</button>
                <button class="btn" type="button" id="cancel_reply">Cancel</button>
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