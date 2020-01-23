class GetOutOfJailCard{
    constructor(description) {
        this.description = description;
    }

    execute = function(player){
        let actualPos = player.getPos();
        let jail = player.isInJail();

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

module.exports = GetOutOfJailCard;
