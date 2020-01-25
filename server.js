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
let Deck = require('./server/Deck');
let CardHandler = require('./server/CardHandler');
let CloseServicesCard = require('./server/CloseServicesCard');
let CloseStationCard = require('./server/CloseStationCard');
let GetOutOfJailCard = require('./server/GetOutOfJailCard');
let GoToCard = require('./server/GoToCard');
let GoToJailCard = require('./server/GoToJailCard');
let HSHandler = require('./server/HSHandler');
let MoveBackCard = require('./server/MoveBackCard');
let PayCard = require('./server/PayCard');
let PayPerBuildingCard = require('./server/PayPerBuildingCard');
let PayPlayerCard = require('./server/PayPlayerCard');
let PlayerHandler = require('./server/PlayerHandler');
let ServicesHandler = require('./server/ServicesHandler');
let Card = require('./server/Card');


app.get('/', function (req, res) {
    console.log('client connected');
    res.sendFile(__dirname + '/client/Menu.html');
})
app.use('/client', express.static(__dirname + '/client'));
serv.listen(1337);

console.log('starting server');
let socketList = [];
let playerList2 = [];
let io = require('socket.io')(serv, {});
let contTot = 0, contLocale = 0;
let persone = 0;
let turn;
let squares = [];
let chance;
let communityChest;
let diceTotal = 0;
let dice1 = 0;
let dice2 = 0;
let doubleDice = 0;
let outcome = true;
let double = false;
let unownedProp = true;
let worker;

io.sockets.on('connection', function (socket) {
    socket.id = contTot;
    contTot++;
    console.log('socket connection ' + socket.id);
    socketList[socket.id] = socket;

    socket.on('getId', function (data) {
        console.log("sending id to client");
        socket.emit('id', { id: socket.id });
    });

    socket.on('getLobby', function (data) {
      let player = new Player(socket.id, data.name);
      playerList2[i] = player;
      i++;
      socket.emit('setLobby', { lobbyID: 0 });
      persone++;
      if (persone == 6) {
        startGame();
        sendPlayers();
        generateTurn();
      }
    });

    //turn started, dice received
    socket.on('dice', function(data) {
      let player = playerList2[socket.id];
      dice1 = data[0];
      dice2 = data[1];
      diceTotal = dice1 + dice2;
      if (dice1 == dice2) {
        doubleDice++;
        double = true;
      } else {
        doubleDice = 0;
      }
      let str = 'rolled the dice: ' + dice1 + ' ' + dice2;
      //checkDoubles(player, doubles);
      if (doubleDice == 3) {
        sendToJail(player);
      }
      if (!player.jail) {
        player = updatePositionDice(playerList2[socket.id], data[0]+data[1]);
        sendPosUpdate(player, str);
      }
      if (player.jail && doubleDice==0 && player.jailCount != 3) {
        sendGenericUpdate(str + ' and stays in jail');
        sendEndMenu(player);
      } else if (player.jail && doubleDice>0) {
        player.jail = false;
        player.jailCount = 0;
        sendJailUpdate(player, true);
        player = updatePositionDice(playerList2[socket.id], data[0]+data[1]);
        sendPosUpdate(player, str);
      } else if (player.jail && doubleDice == 0 && player.jailCount == 3) {
        let str2 = player.name + ' pays 50';
        player.jail = false;
        player.jailCount = 0;
        sendJailUpdate(player, false);
        player.updateMoney(-50);
        sendMoneyUpdate(-50, player, str2);
        player = updatePositionDice(playerList2[socket.id], data[0]+data[1]);
        sendPosUpdate(player, str);
      }
    });

    //landed on square, handle it
    socket.on('handlePlayer', function(data){
        let player = data;
        handlePlayer(player);
    });

    socket.on('stillInJail', function(data) {
      let player = playerList2[data.id];
      let jailCount = player.updateJailCount();
      for (let i = 0; i < socketList.length; i++) {
          socketList[i].emit('jailCountUpdate', player);
      }
    });

    socket.on('getOutOfJailFree', function(data) {
      let player = playerList2[data.id];
      player.getOutOfJailFree = false;
      player.jail = false;
      player.jailCount = 0;
      for (let i = 0; i < socketList.length; i++) {
          socketList[i].emit('getOutOfJailFreeUpdate', player);
      }
      sendJailUpdate(player, false);
      sendTurn();
    });

    socket.on('payJail', function(data) {
      let player = playerList2[data.id];
      outcome = player.updateMoney(50);
      let str = player.name + ' pays 50 to get out of jail';
      sendMoneyUpdate(50, player, str);
      player.jail = false;
      player.jailCount = 0;
      sendJailUpdate(player, false);
      sendTurn();
    });



  socket.on('buyOrAuction', function(data){
    let str = data;
    let player = playerList2[socket.id];
    if (str == 'buy') {
      handleBuy(player);
    } else {
      //auction
    }
  });

  //turn ended, tell next player to start
  socket.on('endTurn', function() {
    diceTotal = 0;
    dice2 = 0;
    dice1 = 0;
    double = false;
    if (doubleDice == 0) {
        updateTurn();
    } else {
      sendTurn();
    }
  });

  socket.on('houseBuild', function(data) {
    //gestisci build
  });

  socket.on('trade', function(data) {
    //gestisci trade
  });

  socket.on('bankrupt', function() {
    //gestisci bankrupt
  })
});

let handleBuy = function(player) {
  let prop = squares[player.pos];
  let str = player.name + ' spends ' + prop.cost;
  let str2 = player.name + ' buys ' + prop.name;
  outcome = player.updateMoney(-prop.cost);
  sendMoneyUpdate(-prop.cost, player, str);
  player.props.push(prop);
  //console.log("prima di setOwner");
  prop.setOwner(player.id);
  //console.log("dopo setOwner");
  // fare controlli se su services
  sendPropUpdate(prop, player, str2);
  sendEndMenu(player);
  //console.log("dopo sendPropUpdate");
  //unownedProp = false;

}

let sendPropUpdate = function(prop, player, str) {
  let pack = [];
  pack.push(prop);
  pack.push(player);
  pack.push(str);
  //console.log("loaded pack");
  for (let i = 0; i < playerList2.length; i++) {

    socketList[i].emit('addProp', pack);
    //console.log("sent pack to " + i);
  }
}

let sendToJail = function(player) {
  let str = player.name + ' sent to jail';
  player.jail = true;
  player.setPos(10);
  sendPosUpdate(player, str);
  sendJailUpdate(player, true);
  updateTurn();
}

let sendJailCountUpdate = function(player) {
  for (let i = 0; i < playerList2.length; i++) {
    socketList[i].emit('jailCountUpdate', player);
  }
}

let updateTurn = function() {
  doubleDice = 0;
  if (turn == playerList2.length-1)
    turn = 0;
  else
    turn ++;
    //console.log("entered updateTurn " + turn);
    sendTurn();
}

let startGame = function () {
    chance = new Deck(true);
    communityChest = new Deck(false);
    squares[0] = new Square(0); //go
    squares[1] = new HouseProperty(1, "Mediterranean Avenue", 60, [2, 10, 30, 90, 160, 250], 50, "brown");
    squares[2] = new CommunityChest(2);
    squares[3] = new HouseProperty(3, "Baltic Avenue", 60, [4, 20, 60, 180, 320, 450], 50, "brown");
    squares[4] = new IncomeTax(4, 100);
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
    squares[38] = new IncomeTax(38, 200);
    squares[39] = new HouseProperty(39, "Boardwalk", 400, [50, 200, 600, 1400, 1700, 2000], 200, "dark blue");
}

let sendPlayers = function () {
    let pack = [];
    for (let i = 0; i < playerList2.length; i++) {
        pack.push(playerList2[i]);
    }
    for (let i = 0; i < socketList.length; i++) {
        socketList[i].emit('startGame', pack);
    }
}

let generateTurn = function() {
  turn = Math.floor(Math.random()*6);
    sendTurn();
}

let sendTurn = function() {
  for (let i = 0; i < socketList.length; i++) {
      socketList[i].emit('turn', turn);
  }
}

let sendPosUpdate = function(player, description) {
  let pack = [];
  pack.push(player);
  pack.push(description);

  for (let i = 0; i < socketList.length; i++) {
      socketList[i].emit('updatePosPlayer', pack);
  }
}

let sendMoneyUpdate = function(rent, player, description) {
  let pack = [];
  pack.push(rent);
  pack.push(player);
  pack.push(description);

  for (let i = 0; i < socketList.length; i++) {
      socketList[i].emit('updateMoneyPlayer', pack);
  }
}

let sendJailUpdate = function(player, doubles) {
  let pack = [];
  pack.push(player);
  pack.push(doubles);
  for (let i = 0; i < socketList.length; i++) {
      socketList[i].emit('jailUpdate', pack);
  }
}

let sendGenericUpdate = function(desc) {
  for (let i = 0; i < socketList.length; i++) {
      socketList[i].emit('genericUpdate', desc);
  }
}

let updatePositionDice = function(player, diceNumber) {
  player.dicePos(diceNumber);
  return player;
}

let updatePosition = function(player, pos) {
  player.setPos(pos);
}

let getOutOfJailFreeUpdate = function(player) {
  for (let i = 0; i < playerList2.length;  i ++){
    socketList[i].emit('getOutOfJailFreeUpdate', player);
  }
}
let handlePlayer = function(pl){
    let player;
    let handler;
    let cardHandler;
    let owner;
    let card;
    let pos;
    let square;
    let playerId;
    let playerSocket;
    let res;
  player = playerList2[pl.id];
   pos = player.getPos();
   square = squares[pos];
  if (square instanceof Property) {
    owner = square.getOwner();
  }
   playerId = player.getId();
   playerSocket = socketList[playerId];
  if(square instanceof HouseProperty || square instanceof Station){
    handler = new HSHandler(player, square);
     res = handler.handle(player);
    switch(res) {
      case 'active':
        payRent(square.getRent(), player, square.getOwner());
        break;
      case 'mortgaged':
        sendGenericUpdate(player.name + ' landed on a mortgaged property');
        sendEndMenu(player);
        break;
      case 'yourProperty':
        sendGenericUpdate(player.name + ' landed on his own property');
        sendEndMenu(player);
        break;
      case 'unownedProperty':
        unownedProperty(player, square);
        break;
      default:
        break;
    }
  }
  else if(square instanceof Services){
    handler = new ServicesHandler(player, diceTotal, square);
    res = handler.handle(owner);
    //payRent che chiama sendUpdateMoney
    switch(res) {
      case -1:
        unownedProperty(player, square);
        break;
      case 0:
      sendGenericUpdate(player.name + ' landed on a mortgaged property');
      sendEndMenu(player);
      break;
      case -2:
      sendGenericUpdate(player.name + ' landed on his own property');
      sendEndMenu(player);
      default:
      payRent(res, player, square.getOwner());
      break;
    }
  } /*
  else if(square instanceof IncomeTax){
    let tax = square.getTax();
    outcome = player.updateMoney(-tax);
    let str = player.name + ' pays ' + tax + ' in taxes';
    sendMoneyUpdate(-tax, player, str);
  }
  else if(square instanceof Chance || square instanceof CommunityChest){
    if(square instanceof Chance)
      card = chance.getCard();
    else
      card = communityChest.getCard();

    if(card instanceof PayCard){
      let res = card.execute();
      outcome = player.updateMoney(res);
      sendMoneyUpdate(res, player, card.description);
    }
    else if(card instanceof GoToCard){
      let pack = card.execute(player);
      let dsc = card.printDescription();
      //if(pos == 10){} //prigione
      player.setPos(pack[0]);
      let str;
      if(pack[1] == 0)
        str = null;
      else {
        str = player.name + ' receives 200 by passing go';
      }
      outcome = player.updateMoney(pack[1]);
      sendPosUpdate(player, dsc);
      sendMoneyUpdate(pack[1], player, str);
      //handle successivo riguardo a nuova casella

    }
    else if(card instanceof GoToJailCard) {
      sendToJail(player);
    }
    else if(card instanceof CloseServicesCard || card instanceof CloseStationCard){
      let pack = card.execute(player);
      let dsc = card.printDescription();
      sendPosUpdate(player, dsc);
      outcome = player.updateMoney(pack[1]);
      let str;
      if (pack[1] == 200)
        str = player.name + ' passes go and collects 200';
      else
        str = null;
      sendMoneyUpdate(pack[1], player, str);
      //handle successivo riguardo a nuova casella
    }
    else if (card instanceof GetOutOfJailCard) {
      player.getOutOfJailFree = true;
      getOutOfJailFreeUpdate(player);
    }
    else if (card instanceof MoveBackCard) {
      let res = card.execute(player);
      let desc = card.printDescription();
      sendPosUpdate(player, desc);
    }
    else if (card instanceof PayPlayerCard) {
      let amount = card.execute;
      let str;
      if (card.boo) {
        str = card.printDescription();
        outcome = player.updateMoney(-amount*(playerList2.length-1));
        sendMoneyUpdate(-amount*(playerList2.length-1), player, str);
        for (let i = 0; i < playerList2.length; i++) {
          if(player.id!= playerlist2[i].id]) {
            str = playerList2[i].name + ' earns' + amount;
            playerlist2[i].updateMoney(amount);
            sendMoneyUpdate(amount, playerList2[i], str);
          }
        }
      } else {
        str = card.printDescription();
        outcome = player.updateMoney(amount*(playerList2.length-1));
        sendMoneyUpdate(amount*(playerList2.length-1), player, str);
        for (let i = 0; i < playerList2.length; i++) {
          if(player.id!= playerlist2[i].id]) {
            str = playerList2[i].name + ' loses' + amount;
            playerlist2[i].updateMoney(-amount);
            sendMoneyUpdate(-amount, playerList2[i], str);
          }
        }
      }
    }
    else if (card instanceof PayPerBuildingCard) {
      let res = card.execute(player);
      outcome = player.updateMoney(res);
      sendMoneyUpdate(res, player, card.description);
    }
  }
  else if(square instanceof Go){
    let str = player.name + ' passes go and collects 200'
    outcome = player.updateMoney(200);
    sendMoneyUpdate(200, player, str);
    //comunica a clients e setta su giocatore;
  }
  else if(square instanceof GoToJail){
    sendToJail(player);
  }
*/
  //fine del turno
  /*if (doubleDice == 0 && !player.jail) {
    //console.log("entered check");
    updateTurn();
  } else if (doubleDice>0 && !player.jail) {
    sendTurn();
  }*/



}

let sendEndMenu(player) {
  socketList[player.id].emit('endMenu');
}

let payRent = function(rent, player, owner){
  //console.log("you must pay him " + rent);
  outcome = player.updateMoney(-rent);
  let outcome2 = playerList2[owner].updateMoney(rent);
  let str = player.name + ' pays ' + rent + ' to ' + playerList2[owner].name;
  let str2 = playerList2[owner].name + ' receives ' + rent;
  sendMoneyUpdate(-rent, player, str);
  sendMoneyUpdate(rent, playerList2[owner], str2);
  sendEndMenu(player);
}


let unownedProperty = function(player, square) {
  let pack = [];
  pack.push(player);
  pack.push(square);
  let str, str2;
  if(square instanceof HouseProperty)
  str = 'HouseProperty';
  else if (square instanceof Services)
  str = 'Services';
  else if (square instanceof Station)
  str = 'Station';
  pack.push(str);
  if (square instanceof Property) {
    str2 = player.name + ' lands on unowned property ' + square.name;
    sendGenericUpdate(str2);
    socketList[player.id].emit('unownedProperty', pack);
  }
}
