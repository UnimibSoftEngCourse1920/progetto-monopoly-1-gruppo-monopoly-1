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
let Game = require('./server/Game');


app.get('/', function (req, res) {
    console.log('client connected');
    res.sendFile(__dirname + '/client/Menu.html');
})
app.use('/client', express.static(__dirname + '/client'));
serv.listen(1337);

console.log('starting server');
let socketList = [];
let playerList = [];
let io = require('socket.io')(serv, {});
let contTot = 0, contLocale = 0;
let persone = 0;
let squares = [];
let chance;
let communityChest;
let turn;
let diceTotal = 0;
let dice1 = 0;
let dice2 = 0;
let doubleDice = 0;
let outcome = true;
let double = false;
let unownedProp = true;
let playerDisconnected = null;
let actualLength = 0;
let playersDisconnected = [];
let classicLobbies = [];
let classicLobbyPointer = 0;
let numPlayerC=0;
let easyLobbies = [];
let easyLobbyPointer = 0;
let numPlayerE=0;
let mediumLobbies = [];
let mediumLobbyPointer = 0;
let numPlayerM = 0;
let hardLobbies = [];
let hardLobbyPointer = 0;
let numPlayerH = 0;
let playerTotList = [];
let actualLobby = [];
let actualGame = null;
let level = -1;
io.sockets.on('connection', function (socket) {
    socket.id = contTot;
    contTot++;
    //console.log("heyyy" + socket.id + ' contTot: ' + contTot + ' contLoc: ' + contLoc);
    console.log('socket connection ' + socket.id);
    socketList[socket.id] = socket;

    socket.on('getId', function (data) {
        console.log("sending id to client");
        socket.emit('id', { id: socket.id });
    });

    socket.on('getLobby', function() {
      if(numPlayerC == 0) {
        classicLobbies[classicLobbyPointer] = [];
        classicLobbies[classicLobbyPointer][0] = [];
      }
      actualLobby = classicLobbies[classicLobbyPointer];
      playerList = actualLobby[0];
      let str = 'Player ' + (numPlayerC + 1)*1;
      let player = new Player(socket.id, numPlayerC, str);
      playerTotList[socket.id] = player;
      //mettilo in classic lobby
      playerList.push(player);
      let pack = [numPlayerC, player.name];
      socket.emit('id', pack);
      numPlayerC++;
      //socket.emit('setLobby', { lobbyID: 0 });
      persone++;
      console.log(playerList[numPlayerC-1].name);
      if (numPlayerC == 6) {
        let game = new Game(0);
        actualGame = game;
        numPlayerC = 0;
        classicLobbyPointer++;
        actualLobby[1] = [];
        actualLobby[2] = [];
        actualLobby[3] = [];
        actualLobby[4] = [];
        actualLobby[5] = game;
        startGame();
        sendPlayers();
        generateTurn();
      }
    })

    socket.on('getEasyLobby', function () {
      if(numPlayerE == 0) {
        easyLobbies[easyLobbyPointer] = [];
        easyLobbies[easyLobbyPointer][0] = [];
      }
      actualLobby = easyLobbies[easyLobbyPointer];
      playerList = actualLobby[0];
      let str = 'Player ' + (numPlayerE + 1)*1;
      let player = new Player(socket.id, numPlayerE, str);
      playerTotList[socket.id] = player;
      //mettilo in classic lobby
      playerList.push(player);
      let pack = [numPlayerE, player.name];
      socket.emit('id', pack);
      numPlayerE++;
      //socket.emit('setLobby', { lobbyID: 0 });
      persone++;
      console.log(playerList[numPlayerE-1].name);
      if (numPlayerE == 6) {
        let game = new Game(1);
        actualGame = game;
        numPlayerE = 0;
        easyLobbyPointer++;
        actualLobby[1] = [];
        actualLobby[2] = [];
        actualLobby[3] = [];
        actualLobby[4] = [];
        actualLobby[5] = game;
        startGame();
        sendPlayers();
        generateTurn();
      }
    });

    socket.on('getMediumLobby', function() {
      if(numPlayerM == 0) {
        mediumLobbies[mediumLobbyPointer] = [];
        mediumLobbies[mediumLobbyPointer][0] = [];
      }
      actualLobby = mediumLobbies[mediumLobbyPointer];
      playerList = actualLobby[0];
      let str = 'Player ' + (numPlayerM + 1)*1;
      let player = new Player(socket.id, numPlayerM, str);
      playerTotList[socket.id] = player;
      //mettilo in classic lobby
      playerList.push(player);
      let pack = [numPlayerM, player.name];
      socket.emit('id', pack);
      numPlayerM++;
      //socket.emit('setLobby', { lobbyID: 0 });
      persone++;
      console.log(playerList[numPlayerM-1].name);
      if (numPlayerM == 6) {
        let game = new Game(2);
        actualGame = game;
        numPlayerM = 0;
        mediumLobbyPointer++;
        actualLobby[1] = [];
        actualLobby[2] = [];
        actualLobby[3] = [];
        actualLobby[4] = [];
        actualLobby[5] = game;
        startGame();
        sendPlayers();
        generateTurn();
      }
    })

    socket.on('getHardLobby', function() {
      if(numPlayerH == 0) {
        hardLobbies[hardLobbyPointer] = [];
        hardLobbies[hardLobbyPointer][0] = [];
      }
      actualLobby = hardLobbies[hardLobbyPointer];
      playerList = actualLobby[0];
      let str = 'Player ' + (numPlayerH + 1)*1;
      let player = new Player(socket.id, numPlayerH, str);
      playerTotList[socket.id] = player;
      //mettilo in classic lobby
      playerList.push(player);
      let pack = [numPlayerH, player.name];
      socket.emit('id', pack);
      numPlayerH++;
      //socket.emit('setLobby', { lobbyID: 0 });
      persone++;
      console.log(playerList[numPlayerH-1].name);
      if (numPlayerH == 6) {
        let game = new Game(3);
        actualGame = game;
        numPlayerH = 0;
        hardLobbyPointer++;
        actualLobby[1] = [];
        actualLobby[2] = [];
        actualLobby[3] = [];
        actualLobby[4] = [];
        actualLobby[5] = game;
        startGame();
        sendPlayers();
        generateTurn();
      }
    })

    //turn started, dice received
    socket.on('dice', function(data) {
      getLobby(socket.id);
      let player = playerTotList[socket.id];
      actualGame.dice1 = data[0];
      actualGame.dice2 = data[1];
      actualGame.diceTotal = actualGame.dice1 + actualGame.dice2;
      if (actualGame.dice1 == actualGame.dice2) {
        actualGame.doubleDice++;
        actualGame.double = true;
      } else {
        actualGame.doubleDice = 0;
      }
      let str = 'rolled the dice: ' + actualGame.dice1 + ' ' + actualGame.dice2;
      //checkDoubles(player, doubles);
      if (actualGame.doubleDice == 3) {
        sendToJail(player);
      } else if (!player.jail) {
        player = updatePositionDice(player, data[0]+data[1]);
        sendPosUpdate(player, str);
      } else if (player.jail && actualGame.doubleDice==0 && player.jailCount != 3) {
        sendGenericUpdate(str + ' and stays in jail');
        sendEndTurn(player, true, 0, null);
      } else if (player.jail && actualGame.doubleDice>0) {
        player.jail = false;
        player.jailCount = 0;
        sendJailUpdate(player, true);
        player = updatePositionDice(player, data[0]+data[1]);
        sendPosUpdate(player, str);
      } else if (player.jail && actualGame.doubleDice == 0 && player.jailCount == 3) {
        actualGame.outcome = player.updateMoney(-50);
        if(!actualGame.outcome) {
          sendEndTurn(player, false, 50, null);
        } else {
          let str2 = player.name + ' pays 50';
          player.jail = false;
          player.jailCount = 0;
          sendJailUpdate(player, false);
          sendMoneyUpdate(-50, player, str2);
          player = updatePositionDice(player, data[0]+data[1]);
          sendPosUpdate(player, str);
        }
      }
    });

    //landed on square, handle it
    socket.on('handlePlayer', function(data){
      getLobby(socket.id);
        let player = data;
        handlePlayer(player);
    });

    socket.on('stillInJail', function(data) {
      getLobby(socket.id);
      let player = playerList[data.id];
      let jailCount = player.updateJailCount();
      for (let i = 0; i < playerList.length; i++) {
        if(playerList[i]!=null)
          socketList[playerList[i].socketId].emit('jailCountUpdate', player);
      }
    });

    socket.on('getOutOfJailFree', function(data) {
      getLobby(socket.id);
      let player = playerList[data.id];
      player.getOutOfJailFree = false;
      player.jail = false;
      player.jailCount = 0;
      for (let i = 0; i < playerList.length; i++) {
        if(playerList[i]!=null)
          socketList[playerList[i].socketId].emit('getOutOfJailFreeUpdate', player);
      }
      sendJailUpdate(player, false);
      sendTurn();
    });


    socket.on('payJail', function(data) {
      getLobby(socket.id);
      let player = playerList[data.id];
      actualGame.outcome = player.updateMoney(-50);
      if (!actualGame.outcome)  {
        sendEndTurn(player, false, 50, null);
      } else {
        let str = player.name + ' pays 50 to get out of jail';
        sendMoneyUpdate(-50, player, str);
        player.jail = false;
        player.jailCount = 0;
        sendJailUpdate(player, false);
        sendTurn();
      }
    });

  socket.on('buyOrAuction', function(data){
    getLobby(socket.id);
    let str = data;
    let player = playerTotList[socket.id];
    if (str == 'buy') {
      handleBuy(player);
    } else {
      //auction
    }
  });

  socket.on('debt', function(data) {
    getLobby(socket.id);
    let str = playerTotList[socket.id] + ' is in debt of ' + data;
    sendGenericUpdate(str);
  })
  //turn ended, tell next player to start
  socket.on('endTurn', function() {
    getLobby(socket.id);
    actualGame.diceTotal = 0;
    actualGame.dice2 = 0;
    actualGame.dice1 = 0;
    actualGame.double = false;
    if (actualGame.doubleDice == 0 || playerTotList[socket.id].jail) {
      updateTurn();
    } else {
      sendTurn();
    }
  });

  socket.on('houseBuild', function(data) {
    getLobby(socket.id);
    //gestisci build
  });

  socket.on('trade', function(data) {
    getLobby(socket.id);
    //gestisci trade
  });

  socket.on('bankrupt', function(data) {
    getLobby(socket.id);
    //gestisci bankrupt
    let ownerOwed;
    actualLength = playerList.length;
    actualGame.playerDisconnected = playerTotList[socket.id];
    //playerList.delete(actualGame.playerDisconnected);
    playersDisconnected.push(actualGame.playerDisconnected.id);
    if (data[1] != null) {
      ownerOwed = playerList[data[1].id];
    } else {
      ownerOwed = null;
    }
    let payedOff = data[0];
    handleBankruptcy(actualGame.playerDisconnected, payedOff, ownerOwed);
  });

  socket.on('disconnect', function() {
    getLobby(socket.id);
    //socketList.delete(socketList[actualGame.playerDisconnected.socketId]);
    handleDisconnect(socketList[socket.id]);
  });

  socket.on('payedDebt', function(data) {
    getLobby(socket.id);
    let moneyOwed = data[0];
    let ownerOwed = data[1];
    let playerInDebt = playerTotList[socket.id];
    handlePlayerDebt(playerInDebt, moneyOwed, ownerOwed);
    console.log("payed debt");
  })
  socket.on('proposeTrade', function(data) {
    getLobby(socket.id);
    let proposer = playerTotList[socket.id];
    let receiver = playerList[data[0].id];
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
    //console.log(proposerProps[0].id);
    //console.log(receiverProps[0].id);
    let pack = [proposer, proposerProps, receiverProps, proposerMon, receiverMon];
    socketList[receiver.socketId].emit('tradeProposal', pack);
  });

  socket.on('nuoveCase', function(data) {
    getLobby(socket.id);
    let player = playerTotList[socket.id];
    let prop = squares[data[0]];
    let numHouses = data[1];
    updateHouses(player, prop, numHouses);
  });

  socket.on('tradeAnswer', function(data) {
    getLobby(socket.id);
    let proposer = data[0];
    let receiver = playerTotList[socket.id];
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
  });

  socket.on('sendMortage', function(data) {
    getLobby(socket.id);
    let player = playerTotList[socket.id];
    let propId = data;
    let prop = squares[propId];
    handleMortgage(player, prop);
  })
});


let handleMortgage  = function(player, prop) {
  let state = prop.state;
  let mon;
  if(state == 'active') {
    mon = prop.mortgaged();
    actualGame.outcome = player.updateMoney(mon);
    sendMoneyUpdate(mon, player, null);
    let str = player.name + ' mortgages ' + prop.name + ' and earns ' + mon;
    sendMortgageUpdate(prop, player, str);
  } else {
    mon = prop.unmortgagePrice;
    actualGame.outcome = player.updateMoney(-mon);
    sendMoneyUpdate(-mon, player, null);
    prop.unmortgaged();
    let str = player.name + ' unmortgages ' + prop.name + ' and pays ' + mon;
    sendMortgageUpdate(prop, player, str);
  }
}

let sendMortgageUpdate=function(prop, player, str) {
  let pack = [player, prop, str];
  for(let i = 0; i < playerList.length; i ++) {
    if(playerList[i] != null) {
      socketList[playerList[i].socketId].emit('mortgageUpdate', pack);
    }
  }
}

let getLobby = function(id) {
  let bool = false;
  bool = getLobbyLoop(id, classicLobbies);
  if(!bool) {
    bool = getLobbyLoop(id, easyLobbies);
  } if(!bool) {
    bool = getLobbyLoop(id, mediumLobbies);
  } if (!bool) {
    bool = getLobbyLoop(id, hardLobbies);
  }
}

let getLobbyLoop = function(id, lobbies) {
  let bool = false;
  for (let i = 0; !bool, i < lobbies.length; i ++) {
    for(let j = 0; !bool, j < lobbies[i][0].length; j ++) {
      if (lobbies[i][0][j] != null)
      if (lobbies[i][0][j].socketId == id) {
        bool = true;
        actualLobby = lobbies[i];
        actualGame = actualLobby[5];
        level = actualGame.level;
        playerList = actualLobby[0];
        squares = actualLobby[1];
        chance = actualLobby[2];
        communityChest = actualLobby[3];
        playersDisconnected = actualLobby[4];
        turn = actualGame.turn;
        diceTotal = actualGame.diceTotal;
        dice1 = actualGame.dice1;
        dice2 = actualGame.dice2;
        doubleDice = actualGame.doubleDice;
        outcome = actualGame.outcome;
        double = actualGame.double;
        playerDisconnected = actualGame.playerDisconnected;
      }
    }
  }
  return bool;
}

let updateHouses = function(player, prop, numHousesDelta) {
  prop.numHouses += numHousesDelta;
  prop.rent = prop.housePrices[prop.numHouses];
  actualLobby.outcome = player.updateMoney(-prop.houseBuildPrice*numHousesDelta);
  let str = player.name + ' pays ' + (-prop.houseBuildPrice*numHousesDelta);
  sendMoneyUpdate(-prop.houseBuildPrice*numHousesDelta, player, str);
  let pack = [player, prop, numHousesDelta];
  for (let i = 0; i < playerList.length; i ++) {
    if(playerList[i]!=null)
    socketList[playerList[i].socketId].emit('updateHouses', pack);
  }
}

let handleBankruptcy = function(payedOff, ownerOwed) {
  playerList[actualGame.playerDisconnected.id] = null;
  if (!payedOff) {
    if(ownerOwed == null) {
      for(let i = 0; i < actualGame.playerDisconnected.props.length; i++) {
        actualGame.playerDisconnected.props[i].owner = -1;
      }
      actualGame.playerDisconnected.props = [];
      actualGame.playerDisconnected.services = [];
      actualGame.playerDisconnected.stations = [];
      actualGame.playerDisconnected.money = 0;
      actualGame.playerDisconnected.pos = 0;
    } else {
      for(let i = 0; i < actualGame.playerDisconnected.props.length; i++) {
        actualGame.playerDisconnected.props[i].owner = ownerOwed.id;
        ownerOwed.props.push(player.props[i]);
        if(actualGame.playerDisconnected.props[i] instanceof Station) {
          ownerOwed.stations.push(player.props[i]);
        } if (actualGame.playerDisconnected.props[i] instanceof Services) {
          ownerOwed.services.push(player.props[i]);
        }
        let str = ownerOwed + ' inherits ' + actualGame.playerDisconnected.props[i].name;
        sendPropUpdate(actualGame.playerDisconnected.props[i], ownerOwed, 0, str);
      }
      actualGame.outcome = ownerOwed.updateMoney(actualGame.playerDisconnected.money);
      let str2 = ownerOwed.name + ' inherits ' + actualGame.playerDisconnected.money;
      sendMoneyUpdate(actualGame.playerDisconnected.money, ownerOwed, str2);
    }
  } else {
    for(let i = 0; i < actualGame.playerDisconnected.props.length; i++) {
      actualGame.playerDisconnected.props[i].owner = -1;
    }
    actualGame.playerDisconnected.props = [];
    actualGame.playerDisconnected.services = [];
    actualGame.playerDisconnected.stations = [];
    actualGame.playerDisconnected.money = 0;
    actualGame.playerDisconnected.pos = 0;
  }
}
let handleDisconnect = function(player) {
  if (actualGame.playerDisconnected == null) {
    actualGame.playerDisconnected = player;
    if(actualGame.playerDisconnected.props != [])
    for(let i = 0; i < actualGame.playerDisconnected.props.length; i++) {
      actualGame.playerDisconnected.props[i].owner = -1;
    }
    actualGame.playerDisconnected.props = [];
    actualGame.playerDisconnected.services = [];
    actualGame.playerDisconnected.stations = [];
    actualGame.playerDisconnected.money = 0;
    actualGame.playerDisconnected.pos = 0;
  }
  for (let i = 0; i < playerList.length; i ++) {
    if(playerList[i]!=null){
    let player2 = playerList[i];
    socketList[player2.socketId].emit('playerDisconnected', actualGame.playerDisconnected);
  }
  }
  checkWon();
  if(actualGame.playerDisconnected.id == actualGame.turn) {
    updateTurn();
  }
  /*let bool = false;
  if(actualGame.playerDisconnected.id != 0 && actualGame.playerDisconnected.id != actualLength-1) {
    for (let i = 0; i < playerList.length; i ++) {
      if(bool) {
        updatePlayerId(playerList[i]);
      } else if(playerList[i].id == actualGame.playerDisconnected.id+1) {
        bool = true;
        updatePlayerId(playerList[i]);
      }
    }
  }*/
}

let checkWon = function() {
  let num = 0;
  let player = null;
  for (let i = 0; i < playerList.length; i ++) {
    if(playerList[i] != null) {
      num++;
      player = playerList[i];
    }
  }
  if (num == 1) {
    socketList[player.socketId].emit('youHaveWon');
  }
}
let handlePlayerDebt = function(playerInDebt, moneyOwed, ownerOwed) {
  if (playerInDebt.jail) {
    let str = 'rolled the dice: ' + dice1 + ' ' + dice2;
    let str2 = playerInDebt.name + ' pays 50';
    playerInDebt.jail = false;
    playerInDebt.jailCount = 0;
    sendJailUpdate(playerInDebt, false);
    actualGame.outcome = playerInDebt.updateMoney(-50);
    sendMoneyUpdate(-50, playerInDebt, str2);
    playerInDebt = updatePositionDice(playerInDebt, diceTotal);
    sendPosUpdate(playerInDebt);
  } else if (ownerOwed == null) {
    console.log("yes");
    actualGame.outcome = playerInDebt.updateMoney(-moneyOwed);
    let str = playerInDebt.name + ' pays off debt of ' + moneyOwed;
    sendMoneyUpdate(-moneyOwed, playerInDebt, str);
    sendEndTurn(playerInDebt, true, 0, null);
  } else {
    actualGame.outcome = ownerOwed.updateMoney(moneyOwed);
    actualGame.outcome = playerInDebt.updateMoney(-moneyOwed);
    let str = ownerOwed.name + ' earns ' + moneyOwed;
    let str2 = playerInDebt.name + ' pays off debt of ' + moneyOwed;
    sendMoneyUpdate(moneyOwed, ownerOwed, str);
    sendMoneyUpdate(-moneyOwed, playerInDebt, str2);
    sendEndTurn(playerInDebt, true, 0, null);
  }
}

let sortOutProps = function(proposer, receiver, proposerProps, receiverProps, proposerMon, receiverMon) {
  actualGame.outcome = playerList[receiver.id].updateMoney(proposerMon);
  actualGame.outcome = playerList[proposer.id].updateMoney(receiverMon);
  actualGame.outcome = playerList[receiver.id].updateMoney(-receiverMon);
  actualGame.outcome = playerList[proposer.id].updateMoney(-proposerMon);
  let str = proposer.name + ' and ' + receiver.name + ' exchange money';
  let str2 = receiver.name + ' and ' + proposer.name + ' exchange money';
  sendMoneyUpdate(proposerMon, receiver, str);
  sendMoneyUpdate(receiverMon, proposer, str2);
  sendMoneyUpdate(-receiverMon, receiver, str);
  sendMoneyUpdate(-proposerMon, proposer, str2);
  let player1 = playerList[proposer.id];
  let player2 = playerList[receiver.id];

  for (let i = 0; i < proposerProps.length; i++) {
    let proposerPropsId = proposerProps[i].id;
    let currentProp;
    for(let j = 0; j < player1.props.length; j++) {
      if(player1.props[j].id == proposerPropsId)
        currentProp = player1.props[j];
    }
    //if else instance of station, services... per aggiornare tutte le liste
    player1.props.splice( player1.props.indexOf(currentProp), 1 );
    //console.log("hey1");
    if(currentProp instanceof Station) {
      player1.stations.splice( player1.stations.indexOf(currentProp), 1 );
    } else if(currentProp instanceof Services) {
      player1.services.splice( player1.services.indexOf(currentProp), 1 );
    }
    let str = player1.name + ' sells ' + currentProp.name + ' to ' + player2.name;
    sendPropUpdate(currentProp, player1, 1, str);
    //console.log(currentProp.name)
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
    //console.log("hey2");
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
  actualGame.outcome = player.updateMoney(-prop.cost);
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
    for (let i = 0; i < playerList.length; i++) {
      if(playerList[i]!=null)
      socketList[playerList[i].socketId].emit('addProp', pack);
    }
  } else {
    for (let i = 0; i < playerList.length; i++) {
      if(playerList[i]!=null)
      socketList[playerList[i].socketId].emit('removeProp', pack);
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
  for (let i = 0; i < playerList.length; i++) {
    if(playerList[i]!=null)
    socketList[playerList[i].socketId].emit('jailCountUpdate', player);
  }
}

let updateTurn = function() {
  actualGame.totalTurns++;
  actualGame.doubleDice = 0;
  if (actualGame.turn == playerList.length-1)
    actualGame.turn = 0;
  else
    actualGame.turn ++;
  if(playerList[actualGame.turn] == null)
      updateTurn();
  if(actualGame.level != 0){
    if(actualGame.totalTurns%24 == 0) {
      disorder();
    }
  }
  sendTurn();
}

let disorder = function(){
    let percentageChange = Math.random()*0.36;
    let change = Math.floor(percentageChange*100);
    let randomNum = Math.floor(Math.random()*2);
    let amount;
    let meno = 0;
    if(randomNum == 0){
      meno = 1;
        for(let y=0; y<chance.cards.length; y++){
            if(chance.cards[y] instanceof PayCard){
                amount = Math.floor(chance.cards[y].amount*percentageChange);
                chance.cards[y].amount += amount;
            }
        }
        for(let x=0; x<communityChest.cards.length; x++){
            if(communityChest.cards[x] instanceof PayCard){
                amount = Math.floor(communityChest.cards[x].amount*percentageChange);
                communityChest.cards[x].amount += amount;
            }
        }
        for(let i=0; i< squares.length; i++){
            if(squares[i] instanceof HouseProperty){
                for(let j=0; j<squares[i].housePrices.length; j++){
                    amount = Math.floor(squares[i].housePrices[j]*percentageChange);
                    squares[i].housePrices[j] += amount;
                }
                amount = Math.floor(squares[i].houseBuildPrice*percentageChange);
                squares[i].houseBuildPrice += amount;
                amount = Math.floor(squares[i].cost*percentageChange);
                squares[i].cost += amount;
                amount = Math.floor(squares[i].rent*percentageChange);
                squares[i].rent += amount;
            }else if(squares[i] instanceof Station){
                for(let j=0; j<squares[i].rentPrices.length; j++){
                    amount = Math.floor(squares[i].rentPrices[j]*percentageChange);
                    squares[i].rentPrices[j] += amount;
                }
                amount = Math.floor(squares[i].cost*percentageChange);
                squares[i].cost += amount;
                amount = Math.floor(squares[i].rent*percentageChange);
                squares[i].rent += amount;
            }else if(squares[i] instanceof IncomeTax){
                amount = Math.floor(squares[i].tax*percentageChange);
                squares[i].tax += amount;
            }
        }
    }else{
      meno = -1;
		for(let y=0; y<chance.cards.length; y++){
            if(chance.cards[y] instanceof PayCard){
                amount = Math.floor(chance.cards[y].amount*percentageChange);
                chance.cards[y].amount -= amount;
            }
        }
        for(let x=0; x<communityChest.cards.length; x++){
            if(communityChest.cards[x] instanceof PayCard){
                amount = Math.floor(communityChest.cards[x].amount*percentageChange);
                communityChest.cards[x].amount -= amount;
            }
        }
        for(let i=0; i< squares.length; i++){
            if(squares[i] instanceof HouseProperty){
                for(let j=0; j<squares[i].housePrices.length; j++){
                    amount = Math.floor(squares[i].housePrices[j]*percentageChange);
                    squares[i].housePrices[j] -= amount;
                }
                amount = Math.floor(squares[i].houseBuildPrice*percentageChange);
                squares[i].houseBuildPrice -= amount;
                amount = Math.floor(squares[i].cost*percentageChange);
                squares[i].cost -= amount;
                amount = Math.floor(squares[i].rent*percentageChange);
                squares[i].rent -= amount;
            }else if(squares[i] instanceof Station){
                for(let j=0; j<squares[i].rentPrices.length; j++){
                    amount = Math.floor(squares[i].rentPrices[j]*percentageChange);
                    squares[i].rentPrices[j] -= amount;
                }
                amount = Math.floor(squares[i].cost*percentageChange);
                squares[i].cost -= amount;
                amount = Math.floor(squares[i].rent*percentageChange);
                squares[i].rent -= amount;
            }else if(squares[i] instanceof IncomeTax){
                amount = Math.floor(squares[i].tax*percentageChange);
                squares[i].tax -= amount;
            }
        }
    }
    for (let i = 0; i < playerList.length; i++) {
      if(playerList[i]!=null){
        socketList[playerList[i].socketId].emit('modifiedConfig', squares);
        let str = 'Prices, rents, costs per house, taxes and card prices have been modified by ' + meno*change + ' percent.';
        sendGenericUpdate(str);
      }
    }
}


let startGame = function () {
    let chanceLoc;
    let communityChestLoc;
    chanceLoc = new Deck(true);
    communityChestLoc = new Deck(false);
    let squaresLoc = [];
    squaresLoc[0] = new Square(0); //go
    squaresLoc[1] = new HouseProperty(1, "Mediterranean Avenue", 60, [2, 10, 30, 90, 160, 250], 50, "brown");
    squaresLoc[2] = new CommunityChest(2);
    squaresLoc[3] = new HouseProperty(3, "Baltic Avenue", 60, [4, 20, 60, 180, 320, 450], 50, "brown");
    squaresLoc[4] = new IncomeTax(4, 200);
    squaresLoc[5] = new Station(5, "Reading Railroad", 200, [25, 50, 100, 200]);
    squaresLoc[6] = new HouseProperty(6, "Oriental Avenue", 100, [6, 30, 90, 270, 400, 550], 50, "lightblue");
    squaresLoc[7] = new Chance(7);
    squaresLoc[8] = new HouseProperty(8, "Vermont Avenue", 100, [6, 30, 90, 270, 400, 550], 50, "lightblue");
    squaresLoc[9] = new HouseProperty(9, "Connecticut Avenue", 120, [8, 40, 100, 300, 450, 600], 50, "lightblue");
    squaresLoc[10] = new Square(10); //jail
    squaresLoc[11] = new HouseProperty(11, "St. Charles Place", 140, [10, 50, 150, 450, 625, 750], 100, "pink");
    squaresLoc[12] = new Services(12, "Electric Company", 150);
    squaresLoc[13] = new HouseProperty(13, "States Avenue", 140, [10, 50, 150, 450, 625, 750], 100, "pink");
    squaresLoc[14] = new HouseProperty(14, "Viriginia Avenue", 160, [12, 60, 180, 500, 700, 900], 100, "pink");
    squaresLoc[15] = new Station(15, "Pennsylvania Railroad", 200, [25, 50, 100, 200]);
    squaresLoc[16] = new HouseProperty(16, "St. James Place", 180, [14, 70, 200, 550, 750, 950], 100, "orange");
    squaresLoc[17] = new CommunityChest(17);
    squaresLoc[18] = new HouseProperty(18, "Tennessee Avenue", 180, [14, 70, 200, 550, 750, 950], 100, "orange");
    squaresLoc[19] = new HouseProperty(19, "New York Avenue", 200, [16, 80, 220, 600, 800, 1000], 100, "orange");
    squaresLoc[20] = new Square(20); //free parking
    squaresLoc[21] = new HouseProperty(21, "Kentucky Avenue", 220, [18, 90, 250, 700, 875, 1050], 150, "red");
    squaresLoc[22] = new Chance(22);
    squaresLoc[23] = new HouseProperty(23, "Indiana Avenue", 220, [18, 90, 250, 700, 875, 1050], 150, "red");
    squaresLoc[24] = new HouseProperty(24, "Illinois Avenue", 240, [20, 100, 300, 750, 925, 1100], 150, "red");
    squaresLoc[25] = new Station(25, "B. & O. Railroad", 200, [25, 50, 100, 200]);
    squaresLoc[26] = new HouseProperty(26, "Atlantic Avenue", 260, [22, 110, 330, 800, 975, 1150], 150, "yellow");
    squaresLoc[27] = new HouseProperty(27, "Ventnor Avenue", 260, [22, 110, 330, 800, 975, 1150], 150, "yellow");
    squaresLoc[28] = new Services(28, "Water Works", 150);
    squaresLoc[29] = new HouseProperty(29, "Marvin Gardens", 280, [24, 120, 360, 850, 1025, 1200], 150, "yellow");
    squaresLoc[30] = new Square(30); //go to jail
    squaresLoc[31] = new HouseProperty(31, "Pacific Avenue", 300, [26, 130, 390, 900, 1100, 1275], 200, "green");
    squaresLoc[32] = new HouseProperty(32, "North Carolina Avenue", 300, [26, 130, 390, 900, 1100, 1275], 200, "green");
    squaresLoc[33] = new CommunityChest(33);
    squaresLoc[34] = new HouseProperty(34, "Pennsylvania Avenue", 320, [28, 150, 450, 1000, 1200, 1400], 200, "green");
    squaresLoc[35] = new Station(35, "Short Line", 200, [25, 50, 100, 200]);
    squaresLoc[36] = new Chance(36);
    squaresLoc[37] = new HouseProperty(37, "Park Place", 350, [35, 175, 500, 1100, 1300, 1500], 200, "darkblue");
    squaresLoc[38] = new IncomeTax(38, 100);
    squaresLoc[39] = new HouseProperty(39, "Boardwalk", 400, [50, 200, 600, 1400, 1700, 2000], 200, "darkblue");
    actualLobby[1] = squaresLoc;
    actualLobby[2] = chanceLoc;
    actualLobby[3] = communityChestLoc;
}

let sendPlayers = function () {
    let pack = [];
    for (let i = 0; i < playerList.length; i++) {
      if(playerList[i]!=null) {
      console.log(playerList[i].name);
        pack.push(playerList[i]);
      }
    }
    for (let i = 0; i < playerList.length; i++) {
      if(playerList[i]!=null)
        socketList[playerList[i].socketId].emit('startGame', pack);
    }
}

let generateTurn = function() {
  turn = Math.floor(Math.random()*6);
  actualGame.turn = turn;
  sendTurn();
}

let sendTurn = function() {
  for (let i = 0; i < playerList.length; i++) {
    if(playerList[i]!=null)
      socketList[playerList[i].socketId].emit('turn', actualGame.turn);
  }
}

let sendPosUpdate = function(player, description) {
  let pack = [];
  pack.push(player);
  pack.push(description);

  for (let i = 0; i < playerList.length; i++) {
    if(playerList[i]!=null)
      socketList[playerList[i].socketId].emit('updatePosPlayer', pack);
  }
}

let sendMoneyUpdate = function(rent, player, description) {
  let pack = [];
  pack.push(rent);
  pack.push(player);
  pack.push(description);

  for (let i = 0; i < playerList.length; i++) {
    if(playerList[i]!=null)
      socketList[playerList[i].socketId].emit('updateMoneyPlayer', pack);
  }
}

let sendJailUpdate = function(player, doubles) {
  let pack = [];
  pack.push(player);
  pack.push(doubles);
  for (let i = 0; i < playerList.length; i++) {
    if(playerList[i]!=null)
      socketList[playerList[i].socketId].emit('jailUpdate', pack);
  }
}

let sendGenericUpdate = function(desc) {
  for (let i = 0; i < playerList.length; i++) {
    if(playerList[i]!=null)
      socketList[playerList[i].socketId].emit('genericUpdate', desc);
  }
}

let updatePositionDice = function(player, diceNumber) {
  let mon = player.dicePos(diceNumber);
  if (mon == 200) {
    let str = player.name + ' passes go and collects 200';
    sendMoneyUpdate(200, player, str);
  }
  return player;
}

let updatePosition = function(player, pos) {
  player.setPos(pos);
}

let getOutOfJailFreeUpdate = function(player) {
  for (let i = 0; i < playerList.length;  i ++){
    if(playerList[i]!=null)
    socketList[playerList[i].socketId].emit('getOutOfJailFreeUpdate', player);
  }
}
let handlePlayer = function(pl){
    let player;
    let handler;
    let cardHandler;
    let owner = -1;
    let card;
    let pos;
    let square;
    let playerSocket;
    let res;
  //console.log("entered handlePlayer");
  player = playerList[pl.id];
   pos = player.getPos();
   console.log('pos ' + pos);
   let cont2 = 0;
   for(let i = 0; i < squares.length; i++) {
     cont2++;
   }
   console.log(cont2);
   square = squares[pos];
  if (square instanceof Property) {
    if(square.owner != -1)
      owner = playerList[square.getOwner()].id;
  }
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
    if(owner == -1)
    res = handler.handle(null);
    else
    res = handler.handle(playerList[owner]);
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
    if(owner == -1)
    res = handler.handle(null);
    else
    res = handler.handle(playerList[owner]);
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
  else if(square instanceof IncomeTax){
    let tax = square.getTax();
    console.log('prima ' +player.money);
    actualGame.outcome = player.updateMoney(-tax);
    console.log('dopo ' +player.money);
    if(!actualGame.outcome) {
      sendEndTurn(player, false, tax, null);
      console.log(actualGame.outcome);
    } else {
      let str = player.name + ' pays ' + tax + ' in taxes';
      sendMoneyUpdate(-tax, player, str);
      sendEndTurn(player, true, 0, null);
      console.log(actualGame.outcome);
    }
  }
  else if(square instanceof Chance || square instanceof CommunityChest){
    if(square instanceof Chance)
      card = chance.getCard();
    else
      card = communityChest.getCard();

    if(card instanceof PayCard){
      let res = card.execute();
      actualGame.outcome = player.updateMoney(res);
      if (!actualGame.outcome) {
        sendEndTurn(player, false, tax, null);
      } else {
        sendMoneyUpdate(res, player, card.description);
        sendEndTurn(player, true, 0, null);
      }
    }
    else if(card instanceof GoToCard){
      let pack = card.execute(player);
      let dsc = card.printDescription();
      //if(pos == 10){} //prigione
      player.setPos(pack[0]);

      if(pack[1] == 200) {
        let str = player.name + ' receives 200 by passing go';
        actualGame.outcome = player.updateMoney(pack[1]);
        sendMoneyUpdate(pack[1], player, str);
      }
      sendPosUpdate(player, dsc);
      sendEndTurn(player, true, 0, null);
      //handle successivo riguardo a nuova casella

    }
    else if(card instanceof GoToJailCard) {
      sendToJail(player);
    }
    else if(card instanceof CloseServicesCard || card instanceof CloseStationCard){
      let pack = card.execute(player);
      let dsc = card.printDescription();
      sendPosUpdate(player, dsc);
      actualGame.outcome = player.updateMoney(pack[1]);
      let str;
      if (pack[1] == 200) {
        str = player.name + ' passes go and collects 200';
        sendMoneyUpdate(pack[1], player, str);
      }
      sendEndTurn(player, true, 0, null);
      //handle successivo riguardo a nuova casella
    }
    else if (card instanceof GetOutOfJailCard) {
      player.getOutOfJailFree = true;
      getOutOfJailFreeUpdate(player);
      sendEndTurn(player, true, 0, null);
    }
    else if (card instanceof MoveBackCard) {
      let res = card.execute(player);
      let desc = card.printDescription();
      sendPosUpdate(player, desc);
      sendEndTurn(player, true, 0, null);
    }
    else if (card instanceof PayPlayerCard) {
      let amount = card.execute;
      let str;
      if (card.boo) {
        str = card.printDescription();
        actualGame.outcome = player.updateMoney(-amount*(playerList.length-1));
        if(!actualGame.outcome) {
          sendEndTurn(player, false, -amount*(playerList.length-1), null);
        } else {
            sendMoneyUpdate(-amount*(playerList.length-1), player, null);
            for (let i = 0; i < playerList.length; i++) {
              if(playerList[i]!=null)
              if(player.id != playerList[i].id) {
                str = playerList[i].name + ' earns' + amount;
                playerList[i].updateMoney(amount);
                sendMoneyUpdate(amount, playerList[i], null);
              }
            }
            sendEndTurn(player, true, 0, null);
          }
      } else {
        str = card.printDescription();
        actualGame.outcome = player.updateMoney(amount*(playerList.length-1));
        sendMoneyUpdate(amount*(playerList.length-1), player, null);
        for (let i = 0; i < playerList.length; i++) {
          if(playerList[i]!=null)
          if(player.id!= playerList[i].id) {
            str = playerList[i].name + ' loses' + amount;
            actualGame.outcome = playerList[i].updateMoney(-amount);
            if(actualGame.outcome)
              sendMoneyUpdate(-amount, playerList[i], null);
          }
        }
        sendEndTurn(player, true, 0, null);
      }
    }
  } else if (card instanceof PayPerBuildingCard) {
      let res = card.execute(player);
      actualGame.outcome = player.updateMoney(res);
      if(!actualGame.outcome) {
        sendEndTurn(player, false, res, null);
      } else {
      sendMoneyUpdate(res, player, card.description);
      sendEndTurn(player, true, 0, null);
      }
  }
  else if(square.id == 0){
    //let str = player.name + ' passes go and collects 200'
    //actualGame.outcome = player.updateMoney(200);
    //sendMoneyUpdate(200, player, str);
    sendEndTurn(player, true, 0, null);
    //comunica a clients e setta su giocatore;
  }
  else if(square.id == 30){
    sendToJail(player);
  }
  else {
    sendEndTurn(player, true, 0, null);
  }
  //fine del turno
}

let payRent = function(rent, player, owner){
  //console.log("you must pay him " + rent);
  console.log(owner.name+ ' is payed');
  actualGame.outcome = player.updateMoney(-rent);
  if(!actualGame.outcome) {
    sendEndTurn(player, false, rent, owner);
  } else {
      let outcome2 = playerList[owner].updateMoney(rent);
      let str = player.name + ' pays ' + rent + ' to ' + playerList[owner].name;
      let str2 = playerList[owner].name + ' receives ' + rent;
      sendMoneyUpdate(-rent, player, str);
      sendMoneyUpdate(rent, playerList[owner], str2);
      sendEndTurn(player, true, 0, null);
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
    socketList[player.socketId].emit('unownedProperty', pack);
  }
}

let sendEndTurn = function(player, boo, money, owner) {
  let pack = [];
  pack.push(boo);
  pack.push(money);
  pack.push(owner);
  socketList[player.socketId].emit('endMenu', pack);
}
