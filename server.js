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
let lobbyFinished = false;

//funzione principale che si occupa dell'ascolto delle richieste da parte dei client
io.sockets.on('connection', function (socket) {
    socket.id = contTot;
    contTot++;
    console.log('socket connection. ID = ' + socket.id);
    socketList[socket.id] = socket;

//quando un giocatore ha cliccato su "classic monopoly" questa funzione si occupa di metterlo in una lobby.
//Verrà creata una nuova lobby se l'ultima lobby creata è gia piena e la partita eè iniziata, altrimenti
//verrà inserito in quella lobby.
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
      playerList.push(player);
      numPlayerC++;
      persone++;
      if (playerList.length == 6) {
        let game = new Game(0);
        actualGame = game;
        numPlayerC = 0;
        classicLobbyPointer++;
        actualLobby[1] = [];
        actualLobby[2] = [];
        actualLobby[3] = [];
        actualLobby[4] = [];
        actualLobby[5] = game;
        actualLobby[6] = true;
        for(let i = 0; i < playerList.length; i++) {
          playerList[i].id = i;
          playerList[i].name = 'Player ' + (i +1)*1;
          let pack = [playerList[i].id, playerList[i].name];
          socketList[playerList[i].socketId].emit('id', pack);
        }
        startGame();
        sendPlayers();
        generateTurn();
      }
    })

//stesso funzionamento della funzione "getLobby", ma questa si occupa delle lobby di tipo "new monopoly" modalità easy
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
      playerList.push(player);
      numPlayerE++;
      persone++;
      if (playerList.length == 6) {
        let game = new Game(1);
        actualGame = game;
        numPlayerE = 0;
        easyLobbyPointer++;
        actualLobby[1] = [];
        actualLobby[2] = [];
        actualLobby[3] = [];
        actualLobby[4] = [];
        actualLobby[5] = game;
        actualLobby[6] = true;
        for(let i = 0; i < playerList.length; i++) {
          playerList[i].id = i;
          playerList[i].name = 'Player ' + (i +1)*1;
          let pack = [playerList[i].id, playerList[i].name];
          socketList[playerList[i].socketId].emit('id', pack);
        }
        startGame();
        sendPlayers();
        generateTurn();
      }
    });

//stesso funzionamento della funzione "getLobby", ma questa si occupa delle lobby di tipo "new monopoly" modalità medium
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
      playerList.push(player);
      numPlayerM++;
      persone++;
      if (playerList.length == 6) {
        let game = new Game(2);
        actualGame = game;
        numPlayerM = 0;
        mediumLobbyPointer++;
        actualLobby[1] = [];
        actualLobby[2] = [];
        actualLobby[3] = [];
        actualLobby[4] = [];
        actualLobby[5] = game;
        actualLobby[6] = true;
        for(let i = 0; i < playerList.length; i++) {
          playerList[i].id = i;
          playerList[i].name = 'Player ' + (i +1)*1;
          let pack = [playerList[i].id, playerList[i].name];
          socketList[playerList[i].socketId].emit('id', pack);
        }
        startGame();
        sendPlayers();
        generateTurn();
      }
    })

//stesso funzionamento della funzione "getLobby", ma questa si occupa delle lobby di tipo "new monopoly" modalità hard.
//inoltre trattandosi di modalità hard se una lobby non è piena e la partita non è ancora terminata, il giocatore Verrà
//inserito in questa lobby.
    socket.on('getHardLobby', function() {
      let bool = loopThroughHardLobbies(socket.id);
      if (!bool) {
        if(numPlayerH == 0) {
          hardLobbies[hardLobbyPointer] = [];
          hardLobbies[hardLobbyPointer][0] = [];
        }
        actualLobby = hardLobbies[hardLobbyPointer];
        playerList = actualLobby[0];
        let str = 'Player ' + (numPlayerH + 1)*1;
        let player = new Player(socket.id, numPlayerH, str);
        playerTotList[socket.id] = player;
        playerList.push(player);
        numPlayerH++;
        persone++;
        if (playerList.length == 6) {
          let game = new Game(3);
          actualGame = game;
          numPlayerH = 0;
          hardLobbyPointer++;
          actualLobby[1] = [];
          actualLobby[2] = [];
          actualLobby[3] = [];
          actualLobby[4] = [];
          actualLobby[5] = game;
          actualLobby[6] = true;
          for(let i = 0; i < playerList.length; i++) {
            playerList[i].id = i;
            playerList[i].name = 'Player ' + (i +1)*1;
            let pack = [playerList[i].id, playerList[i].name];
            socketList[playerList[i].socketId].emit('id', pack);
          }
          startGame();
          sendPlayers();
          generateTurn();
        }
      }
    })

    //ricezione dei dadi tirati dal giocatore, se non è in prigione verrà solamente aggiornata la sua posizione,
    //altrimenti se è in prigione e non è il suo ultimo turno in prigione rimarrà in prigione,
    //altrimenti se è in prigione ed è il suo ultimo turno in prigione il giocatore è costretto ad uscire e pagare 50.
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
          let str2 = player.name + ' pays 50 to get out of jail';
          player.jail = false;
          player.jailCount = 0;
          sendJailUpdate(player, false);
          sendMoneyUpdate(-50, player, str2);
          player = updatePositionDice(player, data[0]+data[1]);
          sendPosUpdate(player, str);
        }
      }
    });

    //appena un giocatore capita su una casella deve essere gestito in base alla specifica funzionalità di quella casella.
    socket.on('handlePlayer', function(data){
      getLobby(socket.id);
        let player = data;
        handlePlayer(player);
    });

    //aggiornamento che viene mandato da un client nel caso costui fosse in prigione e non fosse ancora uscito in questo turno.
    //I client aggiorneranno dunque il numero di turni in cui è rimasto in prigione quel giocatore.
    socket.on('stillInJail', function(data) {
      getLobby(socket.id);
      let player = playerList[data.id];
      let jailCount = player.updateJailCount();
      for (let i = 0; i < playerList.length; i++) {
        if(playerList[i]!=null)
          socketList[playerList[i].socketId].emit('jailCountUpdate', player);
      }
    });

//aggiornamento che viene invocato se un client utilizza la sua carta "getOutOfJailFree" per uscire dalla prigione
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

//aggiornamento che viene invocato se un client decide di uscire volontariamente dalla prigione pagando 50
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

//aggiornamento che viene invocato quando un client capita su una proprieta e decide se comprarla o metterla all'asta
  socket.on('buyOrAuction', function(data){
    getLobby(socket.id);
    let str = data;
    let player = playerTotList[socket.id];
    if (str == 'buy') {
      handleBuy(player);
    } else {
      handleAuction(player);
    }
  });

//aggiornamento che viene invocato se un client è in debito
  socket.on('debt', function(data) {
    getLobby(socket.id);
    let str = playerTotList[socket.id] + ' is in debt of ' + data;
    sendGenericUpdate(str);
  });

  //aggiornamento che viene invocato se un client ha finito il proprio turno, il server dunque aggiornera il turno
  //ovvero passerà il turno al giocatore successivo oppure allo stesso giocatore se ha tirato dadi doppi
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

//aggiornamento che viene invocato se un client decide di disconnettere, o cliccando sul tasto "quit" oppure chiudendo la scheda.
//viene gestita la sua disconnessione
  socket.on('disconnect', function(data) {
    let bool = checkForLobby(socket.id);
    if(bool == 2) {
      getLobby(socket.id);
      let payedOff = data[0];
      let ownerOwed = playerList[data[1].id];
      actualGame.playerDisconnected = playerTotList[socket.id];
      playersDisconnected.push(actualGame.playerDisconnected.id);
      handleBankruptcy(payedOff, ownerOwed);
      handleDisconnect();
    } else {
      if(bool == 1) {
        for (let i = 0; i < actualLobby[0].length; i ++) {
          if(actualLobby[0][i].socketId == socket.id) {
            actualLobby[0].splice(i, 1);
            playerTotList[socket.id] = null;
          }
        }
      }
    }
  });

//aggiornamento che viene invocato se un client è riuscito a riscuotere il debito che aveva o con la banca o con un altro giocatore.
  socket.on('payedDebt', function(data) {
    getLobby(socket.id);
    let moneyOwed = data[0];
    let ownerOwed = data[1];
    let playerInDebt = playerTotList[socket.id];
    handlePlayerDebt(playerInDebt, moneyOwed, ownerOwed);
  });

//aggiornamento che viene invocato se un client decide di proporre uno scambio con un altro giocatore.
//il server dunque si occupa di inoltrare la richiesta al client specifico interessato
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
    let pack = [proposer, proposerProps, receiverProps, proposerMon, receiverMon];
    socketList[receiver.socketId].emit('tradeProposal', pack);
  });

//aggiornamento che viene invocato se un client decide di costruire o togliere case da una sua proprieta usando moneta normale.
  socket.on('nuoveCase', function(data) {
    getLobby(socket.id);
    let player = playerTotList[socket.id];
    let prop = squares[data[0]];
    let numHouses = data[1];
    updateHouses(player, prop, numHouses, false);
  });

//aggiornamento che viene invocato se un client decide di costruire o togliere case da una sua proprieta usando coins.
  socket.on('houseBuildWithCoins', function(data) {
    getLobby(socket.id);
    let prop = squares[data[0]];
    let numHousesDelta = data[1];
    let player = playerTotList[socket.id];
    updateHouses(player, prop, numHousesDelta, true);
  });

//aggiornamento che viene invocato quando un client risponde a una richiesta di scambio con esito positivo o negativo
  socket.on('tradeAnswer', function(data) {
    getLobby(socket.id);
    let proposer = data[0];
    let receiver = playerTotList[socket.id];
    let proposerProps = data[1];
    let receiverProps = data[2];
    let proposerMon = data[3];
    let receiverMon = data[4];
    let response = data[5];
    if(response == 0) {
      let str = receiver.name + ' declined offer of ' + proposer.name;
      sendGenericUpdate(str);
    } else {
      let str = receiver.name + ' accepted offer of ' + proposer.name;
      sendGenericUpdate(str);
      sortOutProps(proposer, receiver, proposerProps, receiverProps, proposerMon, receiverMon);
    }
  });

//aggiornamento che viene invocato se un client decide di ipotecare o disipotecare una sua proprieta.
  socket.on('sendMortage', function(data) {
    getLobby(socket.id);
    let player = playerTotList[socket.id];
    let propId = data;
    let prop = squares[propId];
    handleMortgage(player, prop);
  });

//aggiornamento che viene invocato quando un client propone una cifra più alta della cifra attualmente più alta dell'asta.
//la sua cifra offerta diventera dunque la nuova cifra piu alta
  socket.on('bid', function(data) {
    getLobby(socket.id);
    if(data > actualGame.bid) {
      actualGame.bid = data;
      actualGame.bidder = playerTotList[socket.id];
      updateBid();
    }
  });

//aggiornamento che viene invocato se un client decide di uscire dall'asta
  socket.on('closeBid', function(){
    let player = playerTotList[socket.id];
    player.bidding = false;
    let numBidders = 0;
    let numBidder;
    for(let i = 0; i < playerList.length; i ++) {
      if(playerList[i] != null) {
        if(playerList[i].bidding == true) {
          numBidders ++;
          numBidder = i;
        }
      }
    }
    if(numBidders == 0) {
      sendToWinner();
    } else if (numBidders == 1) {
      if(actualGame.bidder.id == numBidder) {
        actualGame.bidder.bidding = false;
        sendToWinner();
      }
    }
  })
});

//funzione che viene invocata quando un client decide di giocare una partita a "new monopoly" di tipo hard.
//il server dunque cercherà la prima lobby libera in cui inserire il client, anche se la partita corrispondente non è terminata.
let loopThroughHardLobbies = function(socketId) {
  if (hardLobbyPointer == 0)
    return false;
  let bool = false;
  for (let i = 0; !bool, i < hardLobbyPointer; i ++) {
    if (hardLobbies[i] != null && hardLobbies[i][6] != null && hardLobbies[i][6] != false) {
      if(hardLobbies[i][0] != null)
      for(let j = 0; !bool, j < hardLobbies[i][0].length; j ++) {
        let players = hardLobbies[i][0];
        if (players[j] == null) {
          actualLobby = hardLobbies[i];
          playerList = actualLobby[0];
          let str = 'Player ' + (j + 1)*1;
          let player = new Player(socketId, j, str);
          playerTotList[socketId] = player;
          playerList[j] = player;
          let pack = [j, player.name];
          socketList[socketId].emit('id', pack);
          sendPlayersToPlayer(socketId);
          updateOtherPlayers(player);
          return true;
        }
      }
    }
  }
  return bool;
}

//funzione che avvisa gli altri giocatori della "hard" lobby se è arrivato un nuovo giocatore
let updateOtherPlayers = function(player) {
  for (let i = 0; i < playerList.length; i ++) {
    if(playerList[i] != null) {
      socketList[playerList[i].socketId].emit('newPlayer', player);
    }
  }
}

//funzione che si occupa di inviare i players attualmente nella "hard" lobby al nuovo giocatore arrivato, e iniziare dunque
//la sua partita.
let sendPlayersToPlayer = function(socketId) {
  let pack = [];
  let num = 0;
  for (let i = 0; i < playerList.length; i++) {
      pack[i] = playerList[i];
      if(playerList[i] == null)
        num++;
  }
  socketList[socketId].emit('startGame', pack);
}

//funzione che si occupa di mandare al giocatore che ha vinto l'asta la proprietà che ha vinto
let sendToWinner = function() {
  let esci = false;
  if (actualGame.bidder == null) {
    for(let i = 0; !esci, i < playerList.length; i ++) {
      if(playerList[i]!= null) {
        actualGame.bidder = playerList[i];
        esci = true;
      }
    }
  }
  let winner = actualGame.bidder;
  let winPrice = actualGame.bid;
  actualGame.outcome = winner.updateMoney(-winPrice);
  let str = winner.name + ' wins auction for ' + actualGame.propAuction.name;
  sendMoneyUpdate(-winPrice, winner, null);
  winner.addProp(actualGame.propAuction);
  let str2 = winner.name + ' buys ' + actualGame.propAuction.name;
  sendPropUpdate(actualGame.propAuction, winner, 0, str);
  for (let i = 0; i < playerList.length; i++) {
    if(playerList[i] != null) {
      socketList[playerList[i].socketId].emit('endAuction');
    }
  }
  sendEndTurn(playerList[actualGame.turn], true, 0, null);
}

//funzione che aggiorna la cifra attualmente più alta dell'asta
let updateBid = function() {
  for (let i = 0; i < playerList.length; i++) {
    if(playerList[i] != null) {
      socketList[playerList[i].socketId].emit('newHighestBid', actualGame.bid);
    }
  }
}

//funzione che gestisce l'ipoteca o disipoteca di una proprieta
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

//funzione che inizializza l'asta a tutti i client della lobby se un client decide di farlo
let handleAuction = function(player) {
  let prop = squares[player.pos];
  actualGame.propAuction = prop;
  for (let i = 0; i < playerList.length; i ++) {
    if(playerList[i] != null) {
      playerList[i].bidding = true;
      socketList[playerList[i].socketId].emit('startAuction', prop);
    }
  }
}

//funzione che manda un aggiornamento di ipoteca/disipoteca di una proprieta a tutti i player
let sendMortgageUpdate=function(prop, player, str) {
  let pack = [player, prop, str];
  for(let i = 0; i < playerList.length; i ++) {
    if(playerList[i] != null) {
      socketList[playerList[i].socketId].emit('mortgageUpdate', pack);
    }
  }
}

//funzioni che si occupano di andare a prendere la lobby corrispondente del giocatore che ha invocato una "socket.on"
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

let checkForLobby = function(id) {
  let bool = 0;
  bool = checkForLobbyLoop(id, classicLobbies);
  if(bool == 0) {
    bool = checkForLobbyLoop(id, easyLobbies);
  } if(bool == 0) {
    bool = checkForLobbyLoop(id, mediumLobbies);
  } if (bool == 0) {
    bool = checkForLobbyLoop(id, hardLobbies);
  }
  return bool;
}

let checkForLobbyLoop = function(id, lobbies) {
  for (let i = 0; i < lobbies.length; i ++) {
    if(lobbies[i] != null && lobbies[i][0] != null)
    for(let j = 0; j < lobbies[i][0].length; j ++) {
      if(lobbies[i][0][j] != null)
      if (lobbies[i][0][j].socketId == id) {
        if(lobbies[i][5] != null) {
          return 2;
        } else {
          actualLobby = lobbies[i];
          return 1;
        }
      }
    }
  }
  return 0;
}

let getLobbyLoop = function(id, lobbies) {
  let bool = false;
  for (let i = 0; !bool, i < lobbies.length; i ++) {
    if(lobbies[i] != null)
    for(let j = 0; !bool, j < lobbies[i][0].length; j ++) {
      if (lobbies[i][0][j] != null)
      if (lobbies[i][0][j].socketId == id) {
        bool = true;
        actualLobby = lobbies[i];
        actualGame = actualLobby[5];
        if(actualGame == null || actualGame == undefined)
        return false;
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

//funzione che si occupa di aggiornare il numero di case comprate/vendute da un player
let updateHouses = function(player, prop, numHousesDelta, bool) {
  prop.numHouses += numHousesDelta;
  prop.rent = prop.housePrices[prop.numHouses];
  let str;
  let str2;
  if(numHousesDelta >= 0) {
    str = player.name + ' pays ' + (-prop.houseBuildPrice*numHousesDelta);
    str2 = player.name + ' pays ' + (-prop.houseBuildWithCoins*numHousesDelta) + ' in coins';
  } else {
    str = player.name + ' earns ' + (prop.houseBuildPrice*numHousesDelta);
    str2 = player.name + ' earns ' + (prop.houseBuildWithCoins*numHousesDelta) + ' in coins';
  }
  if(!bool) {
    actualLobby.outcome = player.updateMoney(-prop.houseBuildPrice*numHousesDelta);
    sendMoneyUpdate(-prop.houseBuildPrice*numHousesDelta, player, str);
  } else {
    actualLobby.esitoCoin = player.updateCoins(-prop.houseBuildWithCoins*numHousesDelta);
    sendCoinsUpdate(-prop.houseBuildWithCoins*numHousesDelta, player, str2);
  }
  let pack = [player, prop, numHousesDelta];
  for (let i = 0; i < playerList.length; i ++) {
    if(playerList[i]!=null)
    socketList[playerList[i].socketId].emit('updateHouses', pack);
  }
}

//funzione che gestisce la disconnessione di un player dal punto di vista della partita, ovvero:
//se il player si è disconnesso perchè era in debito con qualcuno i suoi soldi e proprieta andranno al player
//con cui era in debito, altrimenti le sue proprieta tornare a non avere un owner.
let handleBankruptcy = function(payedOff, ownerOwed) {
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
        ownerOwed.props.push(actualGame.playerDisconnected.props[i]);
        if(actualGame.playerDisconnected.props[i] instanceof Station) {
          ownerOwed.stations.push(actualGame.playerDisconnected.props[i]);
        } if (actualGame.playerDisconnected.props[i] instanceof Services) {
          ownerOwed.services.push(actualGame.playerDisconnected.props[i]);
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

//funzione che si occupa della disconnessione di un player dal punto di vista delle lobby.
//se è rimasto un solo giocatore nella lobby questo sarà il vincitore
let handleDisconnect = function() {
  playerList[actualGame.playerDisconnected.id] = null;
  for (let i = 0; i < playerList.length; i ++) {
    if(playerList[i]!=null){
      let player2 = playerList[i];
      socketList[player2.socketId].emit('playerDisconnected', actualGame.playerDisconnected);
    }
  }
  checkWon();
  if(actualGame.ended == true) {
    actualLobby[6] = false;
  } else if(actualGame.playerDisconnected.id == actualGame.turn) {
    updateTurn();
  }
}

//controlla se è rimasto un solo giocatore nella lobby
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
    actualGame.ended = true;
  } else if (num == 0) {
    actualGame.ended = true;
  }
}

//funzione che viene invocata se un player era in debito ma ora non lo è più, manda tutti gli aggiornamenti dei soldi.
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
    actualGame.outcome = playerInDebt.updateMoney(-moneyOwed);
    let str = playerInDebt.name + ' pays off debt of ' + moneyOwed;
    sendMoneyUpdate(-moneyOwed, playerInDebt, str);
    sendEndTurn(playerInDebt, true, 0, null);
  } else {
    payRent(moneyOwed, playerInDebt, ownerOwed);
    sendEndTurn(playerInDebt, true, 0, null);
  }
}

//funzione che si occupa di trasferire le proprieta e i soldi da un player a un altro se fanno uno scambio.
let sortOutProps = function(proposer, receiver, proposerProps, receiverProps, proposerMon, receiverMon) {
  actualGame.outcome = playerList[receiver.id].updateMoney(proposerMon);
  actualGame.outcome = playerList[proposer.id].updateMoney(receiverMon);
  actualGame.outcome = playerList[receiver.id].updateMoney(-receiverMon);
  actualGame.outcome = playerList[proposer.id].updateMoney(-proposerMon);
  let str = proposer.name + ' and ' + receiver.name + ' exchange money';
  sendMoneyUpdate(proposerMon, receiver, str);
  sendMoneyUpdate(receiverMon, proposer, null);
  sendMoneyUpdate(-receiverMon, receiver, null);
  sendMoneyUpdate(-proposerMon, proposer, null);

  let player1 = playerList[proposer.id];
  let player2 = playerList[receiver.id];

  if(proposerProps != [] && proposerProps != null) {
    for (let i = 0; i < proposerProps.length; i++) {
      let proposerPropsId = proposerProps[i].id;
      let currentProp;
      for(let j = 0; j < player1.props.length; j++) {
        if(player1.props[j].id == proposerPropsId)
          currentProp = player1.props[j];
      }
      if(currentProp != null) {
        player1.props.splice( player1.props.indexOf(currentProp), 1 );
        if(currentProp instanceof Station) {
          player1.stations.splice( player1.stations.indexOf(currentProp), 1 );
        } else if(currentProp instanceof Services) {
          player1.services.splice( player1.services.indexOf(currentProp), 1 );
        }
        let str = player1.name + ' sells ' + currentProp.name + ' to ' + player2.name;
        sendPropUpdate(currentProp, player1, 1, str);
      }
    }
  }

  if(receiverProps != [] && receiverProps != null) {
    for (let i = 0; i < receiverProps.length; i++) {
      let receiverPropsId = receiverProps[i].id;
      let currentProp;
      for(let j = 0; j < player2.props.length; j++) {
        if(player2.props[j].id == receiverPropsId)
          currentProp = player2.props[j];
      }
      if(currentProp != null) {
        player2.props.splice( player2.props.indexOf(currentProp), 1 );
        if(currentProp instanceof Station) {
          player2.stations.splice( player2.stations.indexOf(currentProp), 1 );
        } else if(currentProp instanceof Services) {
          player2.services.splice( player2.services.indexOf(currentProp), 1 );
        }
        let str = player2.name + ' sells ' + currentProp.name + ' to ' + player1.name;
        sendPropUpdate(currentProp, player2, 1, str);
      }
    }
  }

  if(receiverProps != [] && receiverProps != null) {
    if(proposerProps != [] && proposerProps != null) {
      for (let i = 0; i < proposerProps.length; i++) {
        let p = squares[proposerProps[i].id];
        p.setOwner(player2.id);
        player2.props.push(p);
        if(p instanceof Station) {
          player2.stations.push(p);
        } else if(p instanceof Services) {
          player2.services.push(p);
        }
        let str = player2.name + ' buys ' + p.name + ' from ' + player1.name;
        sendPropUpdate(p, player2, 0, str);
      }
    }
  }

  if(proposerProps != [] && proposerProps != null) {
    if(receiverProps != [] && receiverProps != null) {
      for (let i = 0; i < receiverProps.length; i++) {
        let p = squares[receiverProps[i].id];
        p.setOwner(player1.id);
        player1.props.push(p);
        if(p instanceof Station) {
          player1.stations.push(p);
        } else if(p instanceof Services) {
          player1.services.push(p);
        }
        let str = player1.name + ' buys ' + p.name + ' from ' + player2.name;
        sendPropUpdate(p, player1, 0, str);
      }
    }
  }
}

//funzione che viene invocata quando un player decide di comprare una proprietà su cui è capitato che non è ancora posseduta da nessuno.
let handleBuy = function(player) {
  let prop = squares[player.pos];
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
  sendPropUpdate(prop, player, 0, str2);
  sendEndTurn(player, true, 0, null);
}

//funzione che manda un aggiornamento di proprieta a tutti i player della lobby, ovvero "addProp" quando un player
//ora possiede una nuova proprieta, "removeProp" se gli è stata tolta una proprieta.
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

//funzione che manda in prigione un player e passa il turno al giocatore successivo
let sendToJail = function(player) {
  let str = player.name + ' sent to jail';
  player.jail = true;
  player.setPos(10);
  sendPosUpdate(player, str);
  sendJailUpdate(player, true);
  sendEndTurn(player, true, 0, null);
}

//funzione che manda l'aggiornamento del numero di turni che ha passato in prigione un player
let sendJailCountUpdate = function(player) {
  for (let i = 0; i < playerList.length; i++) {
    if(playerList[i]!=null)
    socketList[playerList[i].socketId].emit('jailCountUpdate', player);
  }
}

//funzione che passa il turno al giocatore successivo della lobby, se qualche player si è disconnesso questa funzione li salta.
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

//funzione che cambia i parametri delle carte e proprieta ogni 24 turni nella "new monopoly".
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

//funzione che viene invocata appena una lobby diventa piena e si può incominciare la partita, imposta le basi del gioco
//come le carte e le proprieta.
let startGame = function () {
    let chanceLoc;
    let communityChestLoc;
    chanceLoc = new Deck(true);
    communityChestLoc = new Deck(false);
    let squaresLoc = [];
    squaresLoc[0] = new Square(0); //go
    squaresLoc[1] = new HouseProperty(1, "Mediterranean Avenue", 60, [2, 10, 30, 90, 160, 250], 50, "brown", 2);
    squaresLoc[2] = new CommunityChest(2);
    squaresLoc[3] = new HouseProperty(3, "Baltic Avenue", 60, [4, 20, 60, 180, 320, 450], 50, "brown", 2);
    squaresLoc[4] = new IncomeTax(4, 200);
    squaresLoc[5] = new Station(5, "Reading Railroad", 200, [25, 50, 100, 200], 3);
    squaresLoc[6] = new HouseProperty(6, "Oriental Avenue", 100, [6, 30, 90, 270, 400, 550], 50, "lightblue", 2);
    squaresLoc[7] = new Chance(7);
    squaresLoc[8] = new HouseProperty(8, "Vermont Avenue", 100, [6, 30, 90, 270, 400, 550], 50, "lightblue", 2);
    squaresLoc[9] = new HouseProperty(9, "Connecticut Avenue", 120, [8, 40, 100, 300, 450, 600], 50, "lightblue", 2);
    squaresLoc[10] = new Square(10); //jail
    squaresLoc[11] = new HouseProperty(11, "St. Charles Place", 140, [10, 50, 150, 450, 625, 750], 100, "pink", 4);
    squaresLoc[12] = new Services(12, "Electric Company", 150, 3);
    squaresLoc[13] = new HouseProperty(13, "States Avenue", 140, [10, 50, 150, 450, 625, 750], 100, "pink", 4);
    squaresLoc[14] = new HouseProperty(14, "Viriginia Avenue", 160, [12, 60, 180, 500, 700, 900], 100, "pink", 4);
    squaresLoc[15] = new Station(15, "Pennsylvania Railroad", 200, [25, 50, 100, 200], 3);
    squaresLoc[16] = new HouseProperty(16, "St. James Place", 180, [14, 70, 200, 550, 750, 950], 100, "orange", 4);
    squaresLoc[17] = new CommunityChest(17);
    squaresLoc[18] = new HouseProperty(18, "Tennessee Avenue", 180, [14, 70, 200, 550, 750, 950], 100, "orange", 4);
    squaresLoc[19] = new HouseProperty(19, "New York Avenue", 200, [16, 80, 220, 600, 800, 1000], 100, "orange", 4);
    squaresLoc[20] = new Square(20); //free parking
    squaresLoc[21] = new HouseProperty(21, "Kentucky Avenue", 220, [18, 90, 250, 700, 875, 1050], 150, "red", 6);
    squaresLoc[22] = new Chance(22);
    squaresLoc[23] = new HouseProperty(23, "Indiana Avenue", 220, [18, 90, 250, 700, 875, 1050], 150, "red", 6);
    squaresLoc[24] = new HouseProperty(24, "Illinois Avenue", 240, [20, 100, 300, 750, 925, 1100], 150, "red", 6);
    squaresLoc[25] = new Station(25, "B. & O. Railroad", 200, [25, 50, 100, 200], 3);
    squaresLoc[26] = new HouseProperty(26, "Atlantic Avenue", 260, [22, 110, 330, 800, 975, 1150], 150, "yellow", 6);
    squaresLoc[27] = new HouseProperty(27, "Ventnor Avenue", 260, [22, 110, 330, 800, 975, 1150], 150, "yellow", 6);
    squaresLoc[28] = new Services(28, "Water Works", 150, 3);
    squaresLoc[29] = new HouseProperty(29, "Marvin Gardens", 280, [24, 120, 360, 850, 1025, 1200], 150, "yellow", 6);
    squaresLoc[30] = new Square(30); //go to jail
    squaresLoc[31] = new HouseProperty(31, "Pacific Avenue", 300, [26, 130, 390, 900, 1100, 1275], 200, "green", 8);
    squaresLoc[32] = new HouseProperty(32, "North Carolina Avenue", 300, [26, 130, 390, 900, 1100, 1275], 200, "green", 8);
    squaresLoc[33] = new CommunityChest(33);
    squaresLoc[34] = new HouseProperty(34, "Pennsylvania Avenue", 320, [28, 150, 450, 1000, 1200, 1400], 200, "green", 8);
    squaresLoc[35] = new Station(35, "Short Line", 200, [25, 50, 100, 200], 3);
    squaresLoc[36] = new Chance(36);
    squaresLoc[37] = new HouseProperty(37, "Park Place", 350, [35, 175, 500, 1100, 1300, 1500], 200, "darkblue", 8);
    squaresLoc[38] = new IncomeTax(38, 100);
    squaresLoc[39] = new HouseProperty(39, "Boardwalk", 400, [50, 200, 600, 1400, 1700, 2000], 200, "darkblue", 8);
    actualLobby[1] = squaresLoc;
    actualLobby[2] = chanceLoc;
    actualLobby[3] = communityChestLoc;
}

//funzione che viene invocata appena una lobby diventa piena prima di incominciare la partita, manda a tutti i players la lista
//di tutti i players nella lobby.
let sendPlayers = function () {
    let pack = [];
    for (let i = 0; i < playerList.length; i++) {
      if(playerList[i]!=null) {
        pack.push(playerList[i]);
      }
    }
    for (let i = 0; i < playerList.length; i++) {
      if(playerList[i]!=null)
        socketList[playerList[i].socketId].emit('startGame', pack);
    }
}

//funzione che genera il giocatore che deve iniziare la partita
let generateTurn = function() {
  turn = Math.floor(Math.random()*6);
  actualGame.turn = turn;
  sendTurn();
}

//funzione che manda il turno attuale della partita a tutti i giocatori, se il turno corrisponde all'id di un giocatore lui inizierà il turno.
let sendTurn = function() {
  for (let i = 0; i < playerList.length; i++) {
    if(playerList[i]!=null)
      socketList[playerList[i].socketId].emit('turn', actualGame.turn);
  }
}

//funzione che manda un aggiornamento di posizione di un giocatore a tutti gli altri players nella lobby
let sendPosUpdate = function(player, description) {
  let pack = [];
  pack.push(player);
  pack.push(description);

  for (let i = 0; i < playerList.length; i++) {
    if(playerList[i]!=null)
      socketList[playerList[i].socketId].emit('updatePosPlayer', pack);
  }
}

//funzione che manda un aggiornamento di denaro di un certo player a tutti gli altri players
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

//funzione che manda un aggiornamento di JailState di un player a tutti gli altri players, ovvero comunica se un player è entrato o uscito da prigione.
let sendJailUpdate = function(player, doubles) {
  let pack = [];
  pack.push(player);
  pack.push(doubles);
  for (let i = 0; i < playerList.length; i++) {
    if(playerList[i]!=null)
      socketList[playerList[i].socketId].emit('jailUpdate', pack);
  }
}

//funzione che manda una banale stringa a tutti i client, che fanno comparire poi a schermo
let sendGenericUpdate = function(desc) {
  for (let i = 0; i < playerList.length; i++) {
    if(playerList[i]!=null)
      socketList[playerList[i].socketId].emit('genericUpdate', desc);
  }
}

//funzione che aggiorna la posizione di un giocatore dopo che ha tirato i dadi
let updatePositionDice = function(player, diceNumber) {
  let mon = player.dicePos(diceNumber);
  if (mon == 200) {
    let str = player.name + ' passes go and collects 200';
    sendMoneyUpdate(200, player, str);
  }
  return player;
}

//funzione che aggiorna la posizione di un player
let updatePosition = function(player, pos) {
  player.setPos(pos);
}

//funzione che comunica a tutti i player se un player si è impossessato di una carta getOutOfJailFree oppure se l'ha usata per uscire di prigione
let getOutOfJailFreeUpdate = function(player) {
  for (let i = 0; i < playerList.length;  i ++){
    if(playerList[i]!=null)
    socketList[playerList[i].socketId].emit('getOutOfJailFreeUpdate', player);
  }
}

//funzione principale che gestisce il turno di un giocatore dopo aver fatto una mossa, in base alla casella in cui è capitato
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
  player = playerList[pl.id];
   pos = player.getPos();
   square = squares[pos];
  if (square instanceof Property) {
    if(square.owner != -1)
      owner = playerList[square.getOwner()].id;
  }
  //se capita in una casella di tipo HouseProperty, ovvero una proprieta con possibilita di costruire case:
  //se è posseduta da qualcuno dovrà pagare quel player, se è ipotecata o sua non dovrà fare niente, se non è
  //posseduta da nessuno può decidere se comprarla o metterla all'asta e passera il turno
  if(square instanceof HouseProperty){
    handler = new HSHandler(player, square);
     res = handler.handle(player);
    switch(res) {
      case 'active':
      if(actualGame.level <=1){
      payRent(square.getRent(), player, square.getOwner(), 0);
    }else{
      payRent(square.getRent(), player, square.getOwner(), square.cashBackCoins);
    }
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
        break;
      default:
        break;
    }
  }
  //se capita in una proprieta di tipo stazione:
  //se è posseduta da qualcuno dovrà pagare quel player, se è ipotecata o sua non dovrà fare niente, se non è
  //posseduta da nessuno può decidere se comprarla o metterla all'asta e passera il turno
  else if (square instanceof Station){
    handler = new StationHandler(player, square);
    if(owner == -1)
    res = handler.handle(null);
    else
    res = handler.handle(playerList[owner]);
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
      if(actualGame.level <=1){
        payRent(square.getRent(), player, square.getOwner(), 0);
      }else{
        payRent(square.getRent(), player, square.getOwner(), square.cashBackCoins);
      }
      break;
    }
  }
  //se capita in una proprieta di tipo services (ovvero WaterWorks o Electric Compoany):
  //se è posseduta da qualcuno dovrà pagare quel player, se è ipotecata o sua non dovrà fare niente, se non è
  //posseduta da nessuno può decidere se comprarla o metterla all'asta, infine passera il turno
  else if (square instanceof Services){
    handler = new ServicesHandler(player, diceTotal, square);
    if(owner == -1)
    res = handler.handle(null);
    else
    res = handler.handle(playerList[owner]);
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
      if(actualGame.level <=1){
        payRent(square.getRent(), player, square.getOwner(), 0);
      }else{
        payRent(square.getRent(), player, square.getOwner(), square.cashBackCoins);
      }
      break;
    }
  }
  //se capita in una casella di tipo income tax dovra pagare le tasse alla banca e passare il turno
  else if(square instanceof IncomeTax){
    let tax = square.getTax();
    actualGame.outcome = player.updateMoney(-tax);
    if(!actualGame.outcome) {
      sendEndTurn(player, false, tax, null);
    } else {
      let str = player.name + ' pays ' + tax + ' in taxes';
      sendMoneyUpdate(-tax, player, str);
      sendEndTurn(player, true, 0, null);
    }
  }
  //se capita in una casella di tipo chance o communityChest peschera una carta evento
  else if(square instanceof Chance || square instanceof CommunityChest){
    if(square instanceof Chance)
      card = chance.getCard();
    else
      card = communityChest.getCard();
      //se la carta pescata è una paycard pagherà la cifra indicata alla banca e passera il turno
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
    //se la carta pescata è una GoToCard andrà alla casella corrispondente e verrà gestita di nuovo la handle per quella casella
    else if(card instanceof GoToCard){
      let pack = card.execute(player);
      let dsc = card.printDescription();
      player.setPos(pack[0]);

      if(pack[1] == 200) {
        let str = player.name + ' receives 200 by passing go';
        actualGame.outcome = player.updateMoney(pack[1]);
        sendMoneyUpdate(pack[1], player, str);
      }
      sendPosUpdate(player, dsc);
      sendEndTurn(player, true, 0, null);
    }
    //se la carta pescata è una GoToJailCard il player andra in prigione e passera il turno
    else if(card instanceof GoToJailCard) {
      sendToJail(player);
    }
    //se la carta pescata è una CloseServicesCard o CloseStationCard andra alla casella station o services più vicina e passera il turno
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
    }
    //se la carta pescata è una GetOutOfJailCard il player si impossessa di una carta getOutOfJailFree e passa il turno
    else if (card instanceof GetOutOfJailCard) {
      player.getOutOfJailFree = true;
      getOutOfJailFreeUpdate(player);
      sendEndTurn(player, true, 0, null);
    }
    //se la carta pescata è una movebackcard il giocatore indietrereggerà alla casella corrsipondente e verrà fatta una nuova handle per quella casella
    else if (card instanceof MoveBackCard) {
      let res = card.execute(player);
      let desc = card.printDescription();
      sendPosUpdate(player, desc);
      sendEndTurn(player, true, 0, null);
    }
    //se la carta pescata è una PayPlayerCard il giocatore ricevera da tutti gli altri/paghera a tutti gli altri players la cifra di quella carta e passerà il turno
    else if (card instanceof PayPlayerCard) {
      let amount = card.execute;
      let str;
      if (card.boo) {
        str = card.printDescription();
        actualGame.outcome = player.updateMoney(-amount*(playerList.length-1));
        if(!actualGame.outcome) {
          sendEndTurn(player, false, -amount*(playerList.length-1), null);
        } else {
            sendMoneyUpdate(-amount*(playerList.length-1), player, str);
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
        sendMoneyUpdate(amount*(playerList.length-1), player, str);
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
    //se la carta pescata è una PayPerBuildingCard il giocatore paghera una cifra alla banca proporzionata al numero di case/hotel possedute e passera il turno
  else if (card instanceof PayPerBuildingCard) {
      let res = card.execute(player);
      if(res != 0) {
        actualGame.outcome = player.updateMoney(res);
        if(!actualGame.outcome) {
          sendEndTurn(player, false, res, null);
        } else {
          sendMoneyUpdate(res, player, card.description);
          sendEndTurn(player, true, 0, null);
        }
      } else {
        sendGenericUpdate(card.description);
        sendEndTurn(player, true, 0, null);
    }
  }
}
//se la casella è la casella Go passerà il turno
  else if(square.id == 0){
    sendEndTurn(player, true, 0, null);
  }
  //se la casella è la casella Go to jail andra in prigione e passera il turno
  else if(square.id == 30){
    sendToJail(player);
  }
  //se la casella è la casella jail passerà il turno
  else if(square.id == 10){
    if (!player.jail) {
      let str = player.name + ' is visiting jail';
      sendGenericUpdate(str);
      sendEndTurn(player, true, 0, null);
    }
    //se la casella è la casella freeparking passerà il turno
  } else if(square.id == 20) {
    let str = player.name + ' landed on free parking';
    sendGenericUpdate(str);
    sendEndTurn(player, true, 0, null);
  } else {
    sendEndTurn(player, true, 0, null);
  }
}

//funzione che si occupa di far pagare il rent al giocatore che è capitato in una proprieta al player che possiede quella proprieta
let payRent = function(rent, player, owner, cashBackCoins){
  actualGame.outcome = player.updateMoney(-rent);
  if(!actualGame.outcome) {
    sendEndTurn(player, false, rent, owner);
  } else {
      let outcome2 = playerList[owner].updateMoney(rent);
      let str = player.name + ' pays ' + rent + ' to ' + playerList[owner].name;
      sendMoneyUpdate(-rent, player, str);
      sendMoneyUpdate(rent, playerList[owner], null);
      if(cashBackCoins != 0) {
        actualGame.esitoCoin = player.updateCoins(cashBackCoins);
        let str3 = playerList[owner].name + ' gives him cashback of ' + cashBackCoins;
        sendCoinsUpdate(cashBackCoins, player, str3);
      }
      sendEndTurn(player, true, 0, null);
    }
}

//funzione che viene invocata se un player capita su una proprieta non ancora posseduta, gli viene ccomunicato e sara lui a decidere se comprarla o no
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

//funzione che si occupa di mandare il menu di fine turno al player corrispondente non appena viene finita la sua handler
//Il player poi deciderà se fare una operazione di trade, ipoteca, costruzione/rimozione case, abbandonare la partita oppure passare il turno
let sendEndTurn = function(player, boo, money, owner) {
  let pack = [];
  pack.push(boo);
  pack.push(money);
  pack.push(owner);
  socketList[player.socketId].emit('endMenu', pack);
}

//funzione che si occupa di mandare un coin update di un player a tutti i player.
let sendCoinsUpdate = function(cashBackCoins, player, description){
   let pack = [];
   pack.push(cashBackCoins);
   pack.push(player);
   pack.push(description);
   for(let i=0; i < playerList.length; i++) {
     if(playerList[i]!= null)
     socketList[playerList[i].socketId].emit('updateCoinsPlayer', pack);
   }
 }
