let Card = require('./Card');
let Player = require('./Player');
class CloseStationCard extends Card{
    constructor(description) {
        super(description);
    }

    execute = function(player){
        let actualPos = player.getPos();
        let newPos = 0;
        let pack = [];

        if(actualPos >= 0 && actualPos < 5){
            newPos = player.setPos(5);
            pack.push(newPos);
            pack.push(0);
            return pack;
        }
        else if(actualPos >= 5 && actualPos < 15){
            newPos = player.setPos(15);
            pack.push(newPos);
            pack.push(0);
            return pack;
        }
        else if(actualPos >= 15 && actualPos < 25){
            newPos = player.setPos(25);
            pack.push(newPos);
            pack.push(0);
            return pack;
        }
        else if(actualPos >= 25 && actualPos < 35){
            newPos = player.setPos(35);
            pack.push(newPos);
            pack.push(0);
            return pack;
        }
        else if(actualPos >= 35 && actualPos < 40){
            newPos = player.setPos(5);
            pack.push(newPos);
            pack.push(200);
            return pack;
        }
    }

    printDescription = function(){
        return this.description;
    }
}

module.exports = CloseStationCard;
