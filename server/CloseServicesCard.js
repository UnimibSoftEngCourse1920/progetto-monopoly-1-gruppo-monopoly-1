class CloseServicesCard{
    constructor(description) {
        this.description = description;
    }

    execute = function(player){
        actualPos = player.getPos();
        newPos = 0;
        let pack = [];

        if(actualPos >= 0 && actualPos < 12){
            newPos = player.setPos(12);
            pack.push(newPos);
            pack.push(0);
            return pack;
        }
        else if(actualPos >= 29 && actualPos < 40){
            player.updateMoney(200);
            newPos = player.setPos(12);
            pack.push(newPos);
            pack.push(200);
            return pack;
        }
        else if(actualPos >= 12 && actualPos < 28){
            newPos = player.setPos(28);
            pack.push(newPos);
            pack.push(0);
            return pack;
        }
        
    }

    printDescription = function(){
        return this.description;
    }
}