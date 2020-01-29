let Card = require('./Card');
let Player = require('./Player');
let Square = require('./Square');
let Property = require('./Property');
let HouseProperty = require('./HouseProperty');
let Station = require('./Station');
let Services = require('./Services');
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
                    total += this.amountPerHotel;
                else
                    total += this.amountPerHouse*props[i].getHouses();
        }
        //player.updateMoney(-total);
        return -total;
    }

    printDescription = function(){
        return this.description;
    }
}

module.exports = PayPerBuildingCard;
