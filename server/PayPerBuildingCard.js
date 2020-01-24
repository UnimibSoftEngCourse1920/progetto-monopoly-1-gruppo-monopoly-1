let Card = require('./server/Card');
let Player = require('./server/Player');
let Square = require('./server/Square');
let Property = require('./server/Property');
let HouseProperty = require('./server/HouseProperty');
let Station = require('./server/Station');
let Services = require('./server/Services');
class PayPerBuildingCard extends Card{
    constructor(amountPerHouse, amountPerHotel, description) {
      super(description);
        this.amountPerHouse = amountPerHouse;
        this.amountPerHotel = amountPerHotel;
    }

    execute = function(player){
        let total = 0;
        let props = player.getProps();

        for(let i=0; i<props.length; i++){
            if(props[i] instanceof HouseProperty)
                if(props[i].getHouses() == 5)
                    total += amountPerHotel;
                else
                    total += amountPerHouse*props[i].getHouses();
        }
        //player.updateMoney(-total);
        return -total;
    }

    printDescription = function(){
        return this.description;
    }
}

module.exports = PayPerBuildingCard;
