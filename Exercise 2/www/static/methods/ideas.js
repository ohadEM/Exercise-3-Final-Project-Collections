
function login() {
    let username = document.getElementById("user").value
    let password = document.getElementById("password").value

    fetch('/users/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    }).then(res => {
        if (res && res.redirected && res.url) {
            window.location.replace(res.url);

        } else {
            return res.json()
        }
    }).then(res => {
        if (res.error) {

            alert('Username and password dont match!')
            window.location.replace('register.html')
        }
    })
}

function getIdeas() {
    fetch('/ideas', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(res => res.json()).then(res => {
        let list = '';

        Object.values(res).forEach((item, index) => {
            list += `${index + 1}: ${item} \n`;
        });
        document.getElementById("list").innerText = list;
    })
}

function putIdeas() {
    let item = document.getElementById("add").value;

    fetch('/idea',
        {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ item })
        }).then(res => res.json())
        .then(res => {
            getIdeas()
        });
}

function deleteIdeas() {
    let item = document.getElementById("delete").value;
    const str = "/idea/" + item;
    fetch(str,
        {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ item })
        }).then(res => res.json()).then(res => {
            if (res === 0) {
                getIdeas()
            }
        });
}

function postIdeas() {
    let item = document.getElementById("id").value;
    let val = document.getElementById("val").value;
    const str = "/idea/" + item;
    fetch(str,
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ item, val })
        }).then(res => res.json()).then(res => {
            if (res === 0) {
                getIdeas();
            }
        })
}

function register() {
    let name = document.getElementById("name").value;
    let username = document.getElementById("user").value;
    let password = document.getElementById("password").value;

    fetch('/users/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, username, password })
    }).then(data => {
        if (data && data.redirected && data.url) {
            window.location.replace(data.url);
        } else {
            alert("username already exits!")
        }
    })
}