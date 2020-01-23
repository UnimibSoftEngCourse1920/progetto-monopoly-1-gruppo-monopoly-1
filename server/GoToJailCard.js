let Player = require('./server/Player');
class GoToJailCard{
    constructor(description){
        this.description = description;
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
