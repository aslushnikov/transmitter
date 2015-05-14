// require sse
var sse = require('server-sent-events');
var express = require('express');
var net = require('net');
var cors = require("cors");
var users = new Set();

var server = net.createServer(function(socket) {
    socket.on("data", function(data) {
        console.log('Received: ' + data);
        for (var response of users) {
            response.sse("data: " + data + "\n\n");
        }
    });
});
server.listen(1337, '127.0.0.1');
console.log("Socket opened on port 1337");

var app = express();
app.use(cors());

app.get('/events', sse, function(req, res) {
    res.sse("data: Hello client!\n\n");
    console.log("A client here!");
    users.add(res);
    res.on("close", function() {
        console.log("Client gone");
        users.delete(res);
    });
});

app.listen(4000);
console.log("Server is running at http://localhost:4000");
