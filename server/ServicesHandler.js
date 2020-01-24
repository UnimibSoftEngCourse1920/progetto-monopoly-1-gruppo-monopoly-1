let Property = require('./server/Property');
let Square = require('./server/Square');
let Player = require('./server/Player');
let Services = require('./server/Services');
class ServicesHandler extends PlayerHandler{
    constructor(player, diceTotal, square){
        super(player, square);
        this.diceTotal = diceTotal;
    }

    handle(){
        let pos = player.getPos();
        let owner = square.getOwner();
        let mult = 0;

        if(owner != null){ //controlla l'array services di player: se ne ha una, ritorna 4, altrimenti 10;
            if(owner.getId() != playerId){
                mult = checkServices(owner);
                //console.log("this property is owned by " + owner.getName());
                if(square.getState() == 'active')
                    return mult*diceTotal;
                else{
                    //console.log("you're lucky, this property is mortgaged");
                    return 0;
                }
            }
        }
        else{
            //console.log("you landed on an unowned property");
            return -1; //client decide se comprare o meno square
        }
    }

    checkServices(owner){
        let count = 0;
        let services = owner.getServices();

        for(let i=0; i<services.length; i++){
         if(services[i] != null)
          count++;
        }
        if(count==1)
         return 4;
        return 10;
      }
}

module.exports = ServicesHandler;
