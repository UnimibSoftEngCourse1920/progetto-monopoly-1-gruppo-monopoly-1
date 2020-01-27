let Player = require('./Player');
let Property = require('./Property');
let Square = require('./Square');
let HouseProperty = require('./HouseProperty');
let Station = require('./Station');
let PlayerHandler = require('./PlayerHandler');
class HSHandler extends PlayerHandler{
    constructor(player, square){
        super(player, square);
    }

    handle(player1){
        let owner = this.square.getOwner();
        let playerId = this.player.getId();

        if(owner != -1){
            if(owner != playerId){
                //console.log("this property is owned by " + owner.getName());
                if(this.square.state == 'active')
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
