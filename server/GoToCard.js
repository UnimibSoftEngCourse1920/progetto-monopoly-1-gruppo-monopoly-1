let Player = require('./Player');
let Card = require('./Card');
class GoToCard extends Card{
    constructor(description, squareIndex){
      super(description);
        this.squareIndex = squareIndex;
    }

    execute(player){
      let pack = [];
        let actualPos = player.getPos();
        if (actualPos != this.squareIndex){
            if(actualPos < this.squareIndex){
                //player.setPos(squareIndex);  //non passa dal via
                pack.push(this.squareIndex);
                pack.push(0);
                return pack;
            }
            else{
                //player.setPos(squareIndex); //passa dal via
                //player.updateMoney(200);
                pack.push(this.squareIndex);
                pack.push(200);
                return pack;
            }
        }
        pack.push(actualPos);
        pack.push(0);
        return pack;
    }
    printDescription() {
      return this.description;
    }
}

module.exports = GoToCard;
