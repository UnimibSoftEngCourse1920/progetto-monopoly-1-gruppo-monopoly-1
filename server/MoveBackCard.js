class MoveBackCard{
    constructor(spaces, description) {
        this.spaces = spaces;
        this.description = description;
    }

    excecute = function(player){
        actualPos = player.getPos();
        player.setPos(actualPos - spaces); //non ho messo controlli perchè ho visto che non si può verificare che si abbia una pos negativa, al minimo è nulla (il via)
    }

    printDescription = function(){
        return this.description;
    }
}