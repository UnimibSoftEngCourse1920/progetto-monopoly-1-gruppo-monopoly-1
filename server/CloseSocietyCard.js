class CloseDrawCard{
    constructor(description) {
        this.description = description;
    }

    excecute = function(player){
        actualPos = player.getPos();
        newPos = 0;

        if(actualPos >= 0 && actualPos < 13){
            newPos = player.setPos(13);
            return newPos;
        }
        else if(actualPos >= 29 && actualPos < 40){
            player.updateMoney(200);
            newPos = player.setPos(13);
            return newPos;
        }
        else if(actualPos >=13 && actualPos < 29){
            newPos = player.setPos(29);
            return newPos;
        }
        
    }

    printDescription = function(){
        return this.description;
    }
}