class CloseStationCard{
    constructor(description) {
        this.description = description;
    }

    excecute = function(player){
        actualPos = player.getPos();
        newPos = 0;

        if(actualPos > 0 && actualPos < 5){
            newPos = player.setPos(5);
            return newPos;
        }
        else if(actualPos > 5 && actualPos < 15){
            newPos = player.setPos(15);
            return newPos;
        }
        else if(actualPos > 15 && actualPos < 25){
            newPos = player.setPos(25);
            return newPos;
        }
        else if(actualPos > 25 && actualPos < 35){
            newPos = player.setPos(35);
            return newPos;
        }
        else if(actualPos > 35 && actualPos < 40){
            newPos = player.setPos(5);
            player.updateMoney(200);
            return newPos;
        }
    }

    printDescription = function(){
        return this.description;
    }
}