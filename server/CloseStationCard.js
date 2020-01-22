class CloseStationCard{
    constructor(description) {
        this.description = description;
    }

    execute = function(player){
        actualPos = player.getPos();
        newPos = 0;
        pack = [];

        if(actualPos > 0 && actualPos < 5){
            newPos = player.setPos(5);
            pack.push(newPos);
            pack.push(0);
            return pack;
        }
        else if(actualPos > 5 && actualPos < 15){
            newPos = player.setPos(15);
            pack.push(newPos);
            pack.push(0);
            return pack;
        }
        else if(actualPos > 15 && actualPos < 25){
            newPos = player.setPos(25);
            pack.push(newPos);
            pack.push(0);
            return pack;
        }
        else if(actualPos > 25 && actualPos < 35){
            newPos = player.setPos(35);
            pack.push(newPos);
            pack.push(0);
            return pack;
        }
        else if(actualPos > 35 && actualPos < 40){
            newPos = player.setPos(5);
            player.updateMoney(200);
            pack.push(newPos);
            pack.push(200);
            return pack;
        }
    }

    printDescription = function(){
        return this.description;
    }
}