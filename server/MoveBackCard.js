let Player = require('./server/Player');
let Card = require('./server/Card');
class MoveBackCard extends Card{
    constructor(spaces, description) {
      super(description);
        this.spaces = spaces;
    }

    execute = function(player){
        let actualPos = player.getPos();
        let newPos = actualPos - spaces;

        player.setPos(newPos); //non ho messo controlli perchè ho visto che non si può verificare che si abbia una pos negativa, al minimo è nulla (il via)
        return newPos;
    }

    printDescription = function(){
        return this.description;
    }
}

module.exports = MoveBackCard;
