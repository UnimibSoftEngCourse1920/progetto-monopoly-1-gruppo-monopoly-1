let Player = require('./Player');
let HouseProperty = require('./HouseProperty');
let Property = require('./Property');
let Services = require('./Services');
let Station = require('./Station');
let Square = require('./Square');
class PlayerHandler{
    constructor(player, square){
        this.player = player;
        this.square = square;
    }

    handle(){}
}

module.exports = PlayerHandler;
