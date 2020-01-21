class GoToJailCard{
    constructor(description){
        this.description = description;
    }

    excecute = function(player){
        player.setPos(30);
    }

    printDescription = function(){
        return this.description;
    }
}