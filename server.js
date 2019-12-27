'use strict';

let express = require('express');
let app = express();
let serv = require('http').Server(app);

app.get('/', function (req, res) {
    console.log('client connected');
    res.sendFile(__dirname + '/client/Menu.html');
})
app.use('/client', express.static(__dirname + '/client'));
serv.listen(1337);

console.log('starting server');
//console.log(__dirname);
let socketList = [];
let io = require('socket.io')(serv, {});
let contTot = 0, contLocale = 0, contLobbies = 0;
let lobbies = [];
let lobby = [], host;
io.sockets.on('connection', function (socket) {
    socket.id = contTot;
    //debug
    console.log('socket connection');
    socket.emit('id', { id:socket.id });
    //debug
    console.log('socket id ' + socket.id);
    lobby[contLocale] = socket;
    //debug
    console.log('id in lobby ' + lobby[contLocale].id);
    if (lobby.length == 6) {
        contLocale = 0;
        lobbies[contLobbies] = lobby;
        lobby = [];
        //debug
        console.log('lobby number ' + contLobbies);
        var x;
        for (x of lobbies[contLobbies])
            console.log(x.id);
        contLobbies++;
    }
    else
        contLocale++;
    contTot++;
    socketList[socket.id] = socket;
    // debug
    

    socket.on('happy', function(data) {
        console.log('happy' + data.reason);
    })
});