class GoToCard{
    constructor(description, squareIndex){
        this.description = description;
        this.squareIndex = squareIndex;
    }

    excecute = function(player){
        actualPos = player.getPos();
        if (actualPos != squareIndex){
            if(actualPos < squareIndex){    
                player.setPos(squareIndex);  //non passa dal via
                return squareIndex;
            }
            else{
                player.setPos(squareIndex); //passa dal via
                player.updateMoney(200);
                return squareIndex;
            }   
        }
        return actualPos;
    }

}