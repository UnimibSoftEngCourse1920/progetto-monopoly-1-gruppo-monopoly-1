let Property = require('./Property');
let Square = require('./Square');
let Player = require('./Player');
let Services = require('./Services');
let PlayerHandler = require('./PlayerHandler');
class StationHandler extends PlayerHandler {
  constructor(player, square) {
    super(player, square);
  }
  handle(owner) {
    let mult = 0;

    if(owner != null){ //controlla l'array services di player: se ne ha una, ritorna 4, altrimenti 10;
        if(owner.id != this.player.id){
            mult = this.checkStations(owner);
            //console.log("this property is owned by " + owner.getName());
            if(this.square.state == 'active')
                return this.square.rentPrices[mult];
            else{
                //console.log("you're lucky, this property is mortgaged");
                return 0;
            }
        } else if (owner.id == this.player.id) {
          return -2;
        }
    }
    else{
        //console.log("you landed on an unowned property");
        return -1; //client decide se comprare o meno square
    }
  }

  checkStations(owner) {
    let count = 0;
    let stations = owner.stations;

    for(let i=0; i<stations.length; i++){
     if(stations[i] != null)
      count++;
    }
    return count;
  }
}

module.exports = StationHandler;
