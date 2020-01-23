class GetOutOfJailCard{
    constructor(description) {
        this.description = description;
    }

    execute = function(player){
        actualPos = player.getPos();
        jail = player.isInJail();

        if(actualPos == 10){
            if(jail){
                player.setJail(false);
                return true;
            }
            return false;
        }
        return false;
    }

    printDescription = function(){
        return this.description;
    }
}
