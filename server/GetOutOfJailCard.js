let Card = require('./Card');
let Player = require('./Player');
class GetOutOfJailCard extends Card{
    constructor(description) {
        super(description);
    }

    execute = function(player){
        let actualPos = player.getPos();
        let jail = player.isInJail();

        if(actualPos == 10){
            if(jail){
                player.setJail(false);
                return true;
            }
            return false;
        }
        return false;
    }

    printDescription = function(){
        return this.description;
    }
}

module.exports = GetOutOfJailCard;
