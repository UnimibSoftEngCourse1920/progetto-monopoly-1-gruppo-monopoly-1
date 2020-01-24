let Card = require('./Card');
let Player = require('./Player');

class CloseServicesCard extends Card {
    constructor(description) {
        super(description);
    }

    execute = function(player){
        let actualPos = player.getPos();
        let newPos = 0;
        let pack = [];

        if(actualPos >= 0 && actualPos < 12){
            newPos = player.setPos(12);
            pack.push(newPos);
            pack.push(0);
            return pack;
        }
        else if(actualPos >= 29 && actualPos < 40){
            newPos = player.setPos(12);
            pack.push(newPos);
            pack.push(200);
            return pack;
        }
        else if(actualPos >= 12 && actualPos < 28){
            newPos = player.setPos(28);
            pack.push(newPos);
            pack.push(0);
            return pack;
        }

    }

    printDescription = function(){
        return this.description;
    }
}

module.exports = CloseServicesCard;
