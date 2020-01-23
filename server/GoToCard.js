class GoToCard{
    constructor(description, squareIndex){
        this.description = description;
        this.squareIndex = squareIndex;
    }

    execute = function(player){
      let pack = []
        let actualPos = player.getPos();
        if (actualPos != squareIndex){
            if(actualPos < squareIndex){
                player.setPos(squareIndex);  //non passa dal via
                pack.push(squareIndex);
                pack.push(0);
                return pack;
            }
            else{
                player.setPos(squareIndex); //passa dal via
                player.updateMoney(200);
                pack.push(squareIndex);
                pack.push(200);
                return pack;
            }
        }
        pack.push(actualPos);
        pack.push(0);
        return pack;
    }

}

module.exports = GoToCard;
