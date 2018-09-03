const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require('fs')
const session = require("express-session")

const app = express();
app.set('trust proxy', 1)
app.use(session({ saveUninitialized: false, resave: false, secret: 'neith', cookie: { mageAge: 1800000 }, rolling: true }))
app.use(express.static('www/static/methods'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let users = {};

app.use((req, res, next) => {
    if (req.session.user) {
        next()
    } else if (req.url === '/users/register' || req.url === '/users/login' || req.url === '/register.html' || req.url === '/login.html' || req.url === '/') {
        next()
    } else if (!req.session.user) {
        res.redirect("/login.html")
    } else {
        res.sendFile(__dirname + "/www/login.html")
    }
})

app.use(express.static('www/static'))

let position = 0;
let todo = {};
todo[position++] = "Home Work Application 1";

app.get('/ideas.html', function (req, res) {
    res.sendFile(__dirname + "/www/static/ideas.html");
})

app.get('static/:filename', function (req, res) {
    res.sendFile(__dirname + "/www/static/readme.html");
})

app.get('/ideas', function (req, res) {
    const username = req.session.user;
    fs.readFile(__dirname + "/users.json", (err, data) => {
        data = JSON.parse(data)
        if (!data || !data[username]) {
            res.json({ error: true })
        } else {
            res.json(data[username].ideas);
        }
    })
})

app.put('/idea', function (req, res) {
    const username = req.session.user;

    fs.readFile(__dirname + "/users.json", (err, data) => {
        data = JSON.parse(data)
        if (!data || !data[username]) {
            res.json({ error: true })

        } else {
            data[username].ideas.push(req.body.item)

            fs.writeFile(__dirname + "/users.json", JSON.stringify(data), function (error) {
                if (!error) {
                    res.json(data[username].ideas.length);
                }
            })
        }
    })
})

app.delete('/idea/:id', function (req, res) {
    if (((req.body.item) < 1) || ((req.body.item - 1) > position) || !(isNaturalNumber(req.body.item))) {
        res.json(1);
    } else {
        delete todo[req.body.item - 1];
        const newtodo = {};
        Object.values(todo).forEach((item, index) => {
            newtodo[index] = item;
        });
        todo = newtodo;
        position--;
        res.json(0);
    }

})

app.post('/idea/:id', function (req, res) {
    if (((req.body.item) < 1) || ((req.body.item - 1) > position) || !(isNaturalNumber(req.body.item))) {
        res.json(1);
    } else {
        todo[req.body.item - 1] = req.body.val;
        res.json(0);
    }
})

app.post('/users/login', function (req, res) {

    const username = req.body.username;

    fs.readFile(__dirname + "/users.json", (err, data) => {
        data = JSON.parse(data)
        if (!data || !data[username] || !(data[username].username === username && data[username].password === req.body.password)) {
            res.json({ error: true })
        } else {
            req.session.user = username
            res.redirect("/ideas.html")
        }
    })
})

app.post('/users/register', function (req, res) {
    fs.readFile(__dirname + "/users.json", (err, data) => {
        data = JSON.parse(data);
        if (!data || data[req.body.username]) {
            res.json({ error: true })
        } else {
            data[req.body.username] = {
                name: req.body.name,
                username: req.body.username,
                password: req.body.password,
                ideas: []
            }

            fs.writeFile(__dirname + "/users.json", JSON.stringify(data), function (error) {
                if (!error) {
                    req.session.name = req.body.username;
                    res.redirect("/ideas.html");
                }
            })
        }
    })
})

function isNaturalNumber(n) {
    n = n.toString(); // force the value incase it is not
    var n1 = Math.abs(n),
        n2 = parseInt(n, 10);
    return !isNaN(n1) && n2 === n1 && n1.toString() === n;
}


var server = app.listen(8052, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Server listening at http://%s:%s", host, port)
})