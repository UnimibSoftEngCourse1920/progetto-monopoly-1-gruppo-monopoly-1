class CloseStationCard{
    constructor(description) {
        this.description = description;
    }

    excecute = function(player){
        actualPos = player.getPos();

        if(actualPos > 0 && actualPos < 5){
            player.setPos(5);
        }
        else if(actualPos > 5 && actualPos < 15){
            player.setPos(15);
        }
        else if(actualPos > 15 && actualPos < 25){
            player.setPos(25);
        }
        else if(actualPos > 25 && actualPos < 35){
            player.setPos(35);
        }
        else if(actualPos > 35 && actualPos < 40){
            player.setPos(5);
            player.updateMoney(200);
        }
    }

    printDescription = function(){
        return this.description;
    }
}