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
let StationHandler = require('./server/StationHandler');
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
let numPlayer=0;
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
      playerList2[numPlayer] = player;
      numPlayer++;
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
        sendEndTurn(player, true, 0, null);
      } else if (player.jail && doubleDice>0) {
        player.jail = false;
        player.jailCount = 0;
        sendJailUpdate(player, true);
        player = updatePositionDice(playerList2[socket.id], data[0]+data[1]);
        sendPosUpdate(player, str);
      } else if (player.jail && doubleDice == 0 && player.jailCount == 3) {
        let str2 = player.name + ' pays 50';
        player.jail = false;
        player.jailCount = false;
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
  });

  socket.on('proposeTrade', function(data) {
    let proposer = playerList2[socket.id];
    let receiver = playerList2[data[0].id];
    let proposerPropsNum = data[1];
    let proposerProps = [];
    for (let i = 0; i < proposerPropsNum.length; i++) {
      proposerProps.push(squares[proposerPropsNum[i]]);
    }
    let receiverPropsNum = data[2];
    let receiverProps = [];
    for (let i = 0; i < receiverPropsNum.length; i++) {
      receiverProps.push(squares[receiverPropsNum[i]]);
    }
    let proposerMon = data[3];
    let receiverMon = data[4];
    let str = proposer.name + ' is trading with ' + receiver.name;
    sendGenericUpdate(str);
    console.log(proposerProps[0].id);
    console.log(receiverProps[0].id);
    let pack = [proposer, proposerProps, receiverProps, proposerMon, receiverMon];
    socketList[receiver.id].emit('tradeProposal', pack);
  });

  socket.on('tradeAnswer', function(data) {
    let proposer = data[0];
    let receiver = playerList2[socket.id];
    let proposerProps = data[1];
    let receiverProps = data[2];
    let proposerMon = data[3];
    let receiverMon = data[4];
    let response = data[5];
    //update tutto
    if(response == 0) {
      let str = receiver.name + ' declined offer of ' + proposer.name;
      sendGenericUpdate(str);
    } else {
      let str = receiver.name + ' accepted offer of ' + proposer.name;
      sendGenericUpdate(str);
      sortOutProps(proposer, receiver, proposerProps, receiverProps, proposerMon, receiverMon);
    }
  })
});


let sortOutProps = function(proposer, receiver, proposerProps, receiverProps, proposerMon, receiverMon) {
  outcome = playerList2[receiver.id].updateMoney(proposerMon);
  outcome = playerList2[proposer.id].updateMoney(receiverMon);
  let str = proposer.name + ' and ' + receiver.name + ' exchange money';
  let str2 = receiver.name + ' and ' + proposer.name + ' exchange money';
  sendMoneyUpdate(proposerMon, receiver, str);
  sendMoneyUpdate(receiverMon, proposer, str2);
  let player1 = playerList2[proposer.id];
  let player2 = playerList2[receiver.id];

  for (let i = 0; i < proposerProps.length; i++) {
    let proposerPropsId = proposerProps[i].id;
    let currentProp;
    for(let j = 0; j < player1.props.length; j++) {
      if(player1.props[j].id == proposerPropsId)
        currentProp = player1.props[j];
    }
    //if else instance of station, services... per aggiornare tutte le liste
    player1.props.splice( player1.props.indexOf(currentProp), 1 );
    if(player1.props == [])
    console.log("hey1");
    if(currentProp instanceof Station) {
      player1.stations.splice( player1.stations.indexOf(currentProp), 1 );
    } else if(currentProp instanceof Services) {
      player1.services.splice( player1.services.indexOf(currentProp), 1 );
    }
    let str = player1.name + ' sells ' + currentProp.name + ' to ' + player2.name;
    sendPropUpdate(currentProp, player1, 1, str);
  }

  for (let i = 0; i < receiverProps.length; i++) {
    let receiverPropsId = receiverProps[i].id;
    let currentProp;
    for(let j = 0; j < player2.props.length; j++) {
      if(player2.props[j].id == receiverPropsId)
        currentProp = player2.props[j];
    }
    //if else instance of station, services... per aggiornare tutte le liste
    player2.props.splice( player2.props.indexOf(currentProp), 1 );
    if(player2.props == [])
    console.log("hey2");
    if(currentProp instanceof Station) {
      player2.stations.splice( player2.stations.indexOf(currentProp), 1 );
    } else if(currentProp instanceof Services) {
      player2.services.splice( player2.services.indexOf(currentProp), 1 );
    }
    let str = player2.name + ' sells ' + currentProp.name + ' to ' + player1.name;
    sendPropUpdate(currentProp, player2, 1, str);
  }

  for (let i = 0; i < proposerProps.length; i++) {
    let p = squares[proposerProps[i].id];
    p.setOwner(player2.id);
    player2.props.push(p);
    if(p instanceof Station) {
      player2.stations.push(p);
    } else if(p instanceof Station) {
      player2.services.push(p);
    }
    let str = player2.name + ' buys ' + p.name + ' from ' + player1.name;
    sendPropUpdate(p, player2, 0, str);
  }
  for (let i = 0; i < receiverProps.length; i++) {
    let p = squares[receiverProps[i].id];
    p.setOwner(player1.id);
    player1.props.push(p);
    if(p instanceof Station) {
      player1.stations.push(p);
    } else if(p instanceof Station) {
      player1.services.push(p);
    }
    let str = player1.name + ' buys ' + p.name + ' from ' + player2.name;
    sendPropUpdate(p, player1, 0, str);
  }
}

let handleBuy = function(player) {
  let prop = squares[player.pos];
  console.log("prop: " + prop.id);
  let str = player.name + ' spends ' + prop.cost;
  let str2 = player.name + ' buys ' + prop.name;
  outcome = player.updateMoney(-prop.cost);
  sendMoneyUpdate(-prop.cost, player, str);
  player.props.push(prop);
  if (prop instanceof Station) {
    player.stations.push(prop);
  } else if(prop instanceof Services) {
    player.services.push(prop);
  }
  prop.setOwner(player.id);
  // fare controlli se su services
  sendPropUpdate(prop, player, 0, str2);
  sendEndTurn(player, true, 0, null);
  //unownedProp = false;

}

let sendPropUpdate = function(prop, player, action, str) {
  let pack = [];
  pack.push(prop);
  pack.push(player);
  pack.push(str);
  let controllo = 0;
  if (prop instanceof Station) {
    controllo = 1;
  }
  if(prop instanceof Services) {
    controllo = 2;
  }
  pack.push(controllo);
  if (action == 0) {
    for (let i = 0; i < playerList2.length; i++) {
      socketList[i].emit('addProp', pack);
    }
  } else {
    for (let i = 0; i < playerList2.length; i++) {
      socketList[i].emit('removeProp', pack);
    }
  }
}

let handleTrade = function(player) {

}
let sendToJail = function(player) {
  let str = player.name + ' sent to jail';
  player.jail = true;
  player.setPos(10);
  sendPosUpdate(player, str);
  sendJailUpdate(player, true);
  sendEndTurn(player, true, 0, null);
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
    squares[6] = new HouseProperty(6, "Oriental Avenue", 100, [6, 30, 90, 270, 400, 550], 50, "lightblue");
    squares[7] = new Chance(7);
    squares[8] = new HouseProperty(8, "Vermont Avenue", 100, [6, 30, 90, 270, 400, 550], 50, "lightblue");
    squares[9] = new HouseProperty(9, "Connecticut Avenue", 120, [8, 40, 100, 300, 450, 600], 50, "lightblue");
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
    squares[37] = new HouseProperty(37, "Park Place", 350, [35, 175, 500, 1100, 1300, 1500], 200, "darkblue");
    squares[38] = new IncomeTax(38, 200);
    squares[39] = new HouseProperty(39, "Boardwalk", 400, [50, 200, 600, 1400, 1700, 2000], 200, "darkblue");
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
  //console.log("entered handlePlayer");
  player = playerList2[pl.id];
   pos = player.getPos();
   square = squares[pos];
  if (square instanceof Property) {
    if(square.owner != -1)
      owner = playerList2[square.getOwner()].id;
  }
   playerId = player.getId();
   playerSocket = socketList[playerId];
  //promemoria: handler per ogni tipo di square
  if(square instanceof HouseProperty){
    handler = new HSHandler(player, square);
     res = handler.handle(player);
    //payRent che chiama sendUpdateMoney
    switch(res) {
      case 'active':
        payRent(square.getRent(), player, square.getOwner());
        break;
      case 'mortgaged':
        sendGenericUpdate(player.name + ' landed on a mortgaged property');
        sendEndTurn(player, true, 0, null);
        break;
      case 'yourProperty':
        sendGenericUpdate(player.name + ' landed on his own property');
        sendEndTurn(player, true, 0, null);
        break;
      case 'unownedProperty':
        unownedProperty(player, square);
        //while(unownedProp){}
        break;
      default:
        break;
    }
  }

  else if (square instanceof Station){
    handler = new StationHandler(player, square);
    res = handler.handle(owner);
    //payRent che chiama sendUpdateMoney
    switch(res) {
      case -1:
        unownedProperty(player, square);
        break;
      case 0:
      sendGenericUpdate(player.name + ' landed on a mortgaged property');
      sendEndTurn(player, true, 0, null);
      break;
      case -2:
      sendGenericUpdate(player.name + ' landed on his own property');
      sendEndTurn(player, true, 0, null);
      break;
      default:
      payRent(res, player, square.getOwner());
      break;
    }
  }

  else if (square instanceof Services){
    handler = new ServicesHandler(player, diceTotal, square);
    res = handler.handle(owner);
    //payRent che chiama sendUpdateMoney
    switch(res) {
      case -1:
        unownedProperty(player, square);
        break;
      case 0:
      sendGenericUpdate(player.name + ' landed on a mortgaged property');
      sendEndTurn(player, true, 0, null);
      break;
      case -2:
      sendGenericUpdate(player.name + ' landed on his own property');
      sendEndTurn(player, true, 0, null);
      break;
      default:
      payRent(res, player, square.getOwner());
      break;
    }
  } else {
    sendEndTurn(player, true, 0, null);
  }/*
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

let payRent = function(rent, player, owner){
  //console.log("you must pay him " + rent);
  outcome = player.updateMoney(-rent);
  let outcome2 = playerList2[owner].updateMoney(rent);
  let str = player.name + ' pays ' + rent + ' to ' + playerList2[owner].name;
  let str2 = playerList2[owner].name + ' receives ' + rent;
  if(outcome) {
    sendMoneyUpdate(-rent, player, str);
    sendMoneyUpdate(rent, playerList2[owner], str2);
    sendEndTurn(player, true, 0, null);
  } else {
    sendEndTurn(player, false, rent, owner);
  }
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

let sendEndTurn = function(player, boo, money, owner) {
  let pack = [];
  pack.push(boo);
  pack.push(money);
  pack.push(owner);
  socketList[player.id].emit('endMenu', pack);
}
