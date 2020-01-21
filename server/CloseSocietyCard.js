class CloseDrawCard{
    constructor(description) {
        this.description = description;
    }

    excecute = function(player){
        actualPos = player.getPos();

        if(actualPos >= 0 && actualPos < 13){
            player.setPos(13);
        }
        else if(actualPos >= 29 && actualPos < 40){
            player.updateMoney(200);
            player.setPos(13);
        }
        else if(actualPos >=13 && actualPos < 29){
            player.setPos(29);
        }
        
    }

    printDescription = function(){
        return this.description;
    }
}