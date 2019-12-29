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
let socketList = [];
let io = require('socket.io')(serv, {});
let contTot = 0, contLocale = 0, contLobbies = 0;
let lobbies = [];
let lobby = [];
let persone = 0;

io.sockets.on('connection', function (socket) {
    socket.id = contTot;
    contTot++;
    console.log('socket connection');
    console.log('socket id ' + socket.id);
    socketList[socket.id] = socket;

    socket.on('getId', function (data) {
        console.log("sending id to client");
        socket.emit('id', { id: socket.id });
        //socket.game = data.game;
    });
    
    socket.on('getLobby', function () {
        socket.emit('setLobby', { lobbyID: 0 });
        persone++;
        if (persone == 6)
            io.emit('startGame');
        //lobby[contLocale] = socket;
        /*console.log('id in lobby ' + lobby[contLocale].id);
        socket.emit('setLobby', { lobbyID: contLobbies });
        if (lobby.length == 6) {
            contLocale = 0;
            lobbies[contLobbies] = lobby;
            lobby = [];
            console.log('lobby number ' + contLobbies);
            let x;
            for (x of lobbies[contLobbies])
                console.log(x.id);
            contLobbies++;
        }
        else
            contLocale++;*/
    });
});
