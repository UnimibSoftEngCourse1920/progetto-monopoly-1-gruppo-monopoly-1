class MoveBackCard{
    constructor(spaces, description) {
        this.spaces = spaces;
        this.description = description;
    }

    execute = function(player){
        let actualPos = player.getPos();
        let newPos = actualPos - spaces;

        player.setPos(newPos); //non ho messo controlli perchè ho visto che non si può verificare che si abbia una pos negativa, al minimo è nulla (il via)
        return newPos;
    }

    printDescription = function(){
        return this.description;
    }
}

module.exports = MoveBackCard;
