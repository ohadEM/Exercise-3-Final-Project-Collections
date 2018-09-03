const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(express.static("www/static"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
    res.json(todo);
})

app.put('/idea', function (req, res) {
    todo[position++] = req.body.item;
    res.json(position - 1);
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