let Player = require('./server/Player');
let Property = require('./server/Property');
let Square = require('./server/Square');
let HouseProperty = require('./server/HouseProperty');
let Station = require('./server/Station');
class HSHandler extends PlayerHandler{
    constructor(player, square){
        super(player, square);
    }

    handle(){
        let pos = player.getPos();
        let owner = square.getOwner();
        let playerId = player.getId();
        let rent = square.getRent();

        if(owner != null){
            if(owner.getId() != playerId){
                //console.log("this property is owned by " + owner.getName());
                if(square.getState() == 'active')
                    return 'active';
                else{
                    //console.log("you're lucky, this property is mortgaged");
                    return 'mortgaged';
                }
            }
            else{
                //console.log("you landed on a property of yours");
                return 'yourProperty';
            }
        }
        else{
            //console.log("you landed on an unowned property");
            return 'unownedProperty'; //cliente decide se comprare o meno square
        }
    }


}

module.exports = HSHandler;
