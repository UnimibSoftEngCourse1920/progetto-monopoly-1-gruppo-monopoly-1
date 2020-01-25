let Property = require('./Property');
//let Player = require('./Player');
class HouseProperty extends Property {
    constructor(id, name, cost, housePrices, houseBuildPrice, colour) {
        super(id, name, cost, housePrices[0]);
        this.houseBuildPrice = houseBuildPrice;
        this.houses = 0;
        this.housePrices = housePrices;
        this.colour = colour;
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
        return this.houses;
    }

    getBuildPrice(){
        return this.houseBuildPrice;
    }

}

module.exports = HouseProperty;
