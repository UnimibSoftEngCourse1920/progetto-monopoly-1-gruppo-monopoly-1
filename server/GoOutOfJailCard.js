class GoOutOfJailCard{
    constructor(description) {
        this.description = description;
    }

    excecute = function(player){
        actualPos = player.getPos();
        jail = player.isInJail();

        if(actualPos == /*bella domanda*/){
            if(jail){
                player.setJail(false);
                //rollaggio dadi? non qui direi
            }
        }
    }

    printDescription = function(){
        return this.description;
    }
}