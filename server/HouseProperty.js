let Property = require('./Property');
//let Player = require('./Player');
class HouseProperty extends Property {
    constructor(id, name, cost, housePrices, houseBuildPrice, colour, cashBackCoins) {
        super(id, name, cost, housePrices[0], cashBackCoins);
        this.houseBuildPrice = houseBuildPrice;
        this.houses = 0;
        this.housePrices = housePrices;
        this.colour = colour;
        this.numHouses = 0;
        this.houseBuildWithCoins = this.houseBuildPrice/5;
    }

    addHouse() {
        if (this.houses < 5) {
            this.houses++;
            this.rent = this.housePrices[this.houses];
            return true;
        }
        else
            return false;
    }

    removeHouse() {
        if (this.houses > 0) {
            this.houses--;
            this.rent = this.housePrices[this.houses];
            return true;
        }
        else
            return false;
    }

    getHouses(){
        return this.numHouses;
    }

    getBuildPrice(){
        return this.houseBuildPrice;
    }

}

module.exports = HouseProperty;
