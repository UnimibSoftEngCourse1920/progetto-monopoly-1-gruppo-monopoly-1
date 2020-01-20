'use strict';

let express = require('express');
let app = express();
let serv = require('http').Server(app);
let Property = require('./server/Property');
let Services = require('./server/Services');
let Station = require('./server/Station');
let HouseProperty = require('./server/HouseProperty');
let Player = require('./server/Player');
let Square = require('./server/Square');
let Chance = require('./server/Chance');
let CommunityChest = require('./server/CommunityChest');
let IncomeTax = require('./server/IncomeTax');


app.get('/', function (req, res) {
    console.log('client connected');
    res.sendFile(__dirname + '/client/Menu.html');
})
app.use('/client', express.static(__dirname + '/client'));
serv.listen(1337);

console.log('starting server');
let socketList = [];
let playerList = [];
let playerList2 = [];
let io = require('socket.io')(serv, {});
let contTot = 0, contLocale = 0, contLobbies = 0;
let lobbies = [];
let lobby = [];
let persone = 0;
let i = 0;


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
    
    socket.on('getLobby', function (data) {
        let player = new Player(socket.id, data.name);
        //let playerAttributes = [];
        playerList2[i] = player;
        i++;
        //playerList2[socket.id] = player;
        //i++;
        //console.log(playerList2[socket.id][0] + " " + playerList2[socket.id][1]);
        //console.log("player attributes: " + player.name);
        //playerList[socket.id] = player;
        socket.emit('setLobby', { lobbyID: 0 });
        persone++;
        if (persone == 6) {
            startGame();
            sendPlayers();
            //for (let j = 0; j < playerList2.length; j+2)
              // console.log(playerList2[j] + " " + playerList2[j+1]);
            //io.emit('startGame', { Players: playerList2 });
        }
        
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

let sendPlayers = function () {
    let pack = [];
    for (let i = 0; i < playerList2.length; i++) {
        pack.push(playerList2[i]);
    }
    for (let i = 0; i < socketList.length; i++) {
        socketList[i].emit('startGame', pack);
    }
}
let startGame = function () {
    let squares = [];
    squares[0] = new Square(0); //go
    squares[1] = new HouseProperty(1, "Mediterranean Avenue", 60, [2, 10, 30, 90, 160, 250], 50, "brown");
    squares[2] = new CommunityChest(2);
    squares[3] = new HouseProperty(3, "Baltic Avenue", 60, [4, 20, 60, 180, 320, 450], 50, "brown");
    squares[4] = new IncomeTax(4);
    squares[5] = new Station(5, "Reading Railroad", 200, [25, 50, 100, 200]);
    squares[6] = new HouseProperty(6, "Oriental Avenue", 100, [6, 30, 90, 270, 400, 550], 50, "light blue");
    squares[7] = new Chance(7);
    squares[8] = new HouseProperty(8, "Vermont Avenue", 100, [6, 30, 90, 270, 400, 550], 50, "light blue");
    squares[9] = new HouseProperty(9, "Connecticut Avenue", 120, [8, 40, 100, 300, 450, 600], 50, "light blue");
    squares[10] = new Square(10); //jail
    squares[11] = new HouseProperty(11, "St. Charles Place", 140, [10, 50, 150, 450, 625, 750], 100, "pink");
    squares[12] = new Services(12, "Electric Company", 150);
    squares[13] = new HouseProperty(13, "States Avenue", 140, [10, 50, 150, 450, 625, 750], 100, "pink");
    squares[14] = new HouseProperty(14, "Viriginia Avenue", 160, [12, 60, 180, 500, 700, 900], 100, "pink");
    squares[15] = new Station(15, "Pennsylvania Railroad", 200, [25, 50, 100, 200]);
    squares[16] = new HouseProperty(16, "St. James Place", 180, [14, 70, 200, 550, 750, 950], 100, "orange");
    squares[17] = new CommunityChest(17);
    squares[18] = new HouseProperty(18, "Tennessee Avenue", 180, [14, 70, 200, 550, 750, 950], 100, "orange");
    squares[19] = new HouseProperty(19, "New York Avenue", 200, [16, 80, 220, 600, 800, 1000], 100, "orange");
    squares[20] = new Square(20); //free parking
    squares[21] = new HouseProperty(21, "Kentucky Avenue", 220, [18, 90, 250, 700, 875, 1050], 150, "red");
    squares[22] = new Chance(22);
    squares[23] = new HouseProperty(23, "Indiana Avenue", 220, [18, 90, 250, 700, 875, 1050], 150, "red");
    squares[24] = new HouseProperty(24, "Illinois Avenue", 240, [20, 100, 300, 750, 925, 1100], 150, "red");
    squares[25] = new Station(25, "B. & O. Railroad", 200, [25, 50, 100, 200]);
    squares[26] = new HouseProperty(26, "Atlantic Avenue", 260, [22, 110, 330, 800, 975, 1150], 150, "yellow");
    squares[27] = new HouseProperty(27, "Ventnor Avenue", 260, [22, 110, 330, 800, 975, 1150], 150, "yellow");
    squares[28] = new Services(28, "Water Works", 150);
    squares[29] = new HouseProperty(29, "Marvin Gardens", 280, [24, 120, 360, 850, 1025, 1200], 150, "yellow");
    squares[30] = new Square(30); //go to jail
    squares[31] = new HouseProperty(31, "Pacific Avenue", 300, [26, 130, 390, 900, 1100, 1275], 200, "green"); 
    squares[32] = new HouseProperty(32, "North Carolina Avenue", 300, [26, 130, 390, 900, 1100, 1275], 200, "green");
    squares[33] = new CommunityChest(33);
    squares[34] = new HouseProperty(34, "Pennsylvania Avenue", 320, [28, 150, 450, 1000, 1200, 1400], 200, "green");
    squares[35] = new Station(35, "Short Line", 200, [25, 50, 100, 200]);
    squares[36] = new Chance(36);
    squares[37] = new HouseProperty(37, "Park Place", 350, [35, 175, 500, 1100, 1300, 1500], 200, "dark blue");
    squares[38] = new IncomeTax(38);
    squares[39] = new HouseProperty(39, "Boardwalk", 400, [50, 200, 600, 1400, 1700, 2000], 200, "dark blue"); 

    createPlayers();

}

let createPlayers = function () {

}