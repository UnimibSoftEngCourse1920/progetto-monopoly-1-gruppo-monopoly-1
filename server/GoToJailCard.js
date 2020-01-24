let Player = require('./Player');
let Card = require('./Card');
class GoToJailCard extends Card{
    constructor(description){
        super(description);
    }

    execute(player){
        let actualPos = player.getPos();
        if (actualPos != 10) {
            //player.setPos(10);  //non passa dal via
            player.jail = true;
          }
        return 10;
    }

    printDescription(){
        return this.description;
    }
}

module.exports = GoToJailCard;
