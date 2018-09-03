function getIdeas() {
    fetch('/ideas').then(res => res.json()).then(res => {
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
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ item })
        }).then(res => res.json()).then(res => { getIdeas() });
}

function deleteIdeas() {
    let item = document.getElementById("delete").value;
    const str = "/idea/" + item;
    fetch(str,
        {
            method: 'DELETE',
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