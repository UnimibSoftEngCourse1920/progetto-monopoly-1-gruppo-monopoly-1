let Player = require('./server/Player');
let HouseProperty = require('./server/HouseProperty');
let Property = require('./server/Property');
let Services = require('./server/Services');
let Station = require('./server/Station');
let Square = require('./server/Square');
class PlayerHandler{
    constructor(player, square){
        this.player = player;
        this.square = square;
    }

    handle(){}
}

module.exports = PlayerHandler;
