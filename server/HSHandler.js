class HSHandler extends PlayerHandler{
    constructor(player, square){
        super(player, square);
    }

    handle(){
        pos = player.getPos();
        owner = square.getOwner();
        playerId = player.getId();
        rent = square.getRent();

        if(owner != null){
            if(owner.getId() != playerId){
                console.log("this property is owned by " + owner.getName());
                if(square.getState() == 'active')
                    return 'active';
                else{
                    console.log("you're lucky, this property is mortgaged");
                    return 'mortgaged';
                }
            }
            else{
                console.log("you landed on a property of yours");
                return 'yourProperty';
            }
        }
        else{
            console.log("you landed on an unowned property");
            return 'unownedProperty'; //cliente decide se comprare o meno square
        }
    }


}
