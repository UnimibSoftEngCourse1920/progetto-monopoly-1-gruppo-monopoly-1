let Property = require('./Property');
let Square = require('./Square');
let Player = require('./Player');
let Services = require('./Services');
let PlayerHandler = require('./PlayerHandler');
class ServicesHandler extends PlayerHandler{
    constructor(player, diceTotal, square){
        super(player, square);
        this.diceTotal = diceTotal;
    }

    handle(owner){
        let pos = this.player.getPos();
        let mult = 0;

        if(owner != null){ //controlla l'array services di player: se ne ha una, ritorna 4, altrimenti 10;
            if(owner != this.player.id){
                mult = checkServices(owner);
                //console.log("this property is owned by " + owner.getName());
                if(this.square.state == 'active')
                    return mult*this.diceTotal;
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
