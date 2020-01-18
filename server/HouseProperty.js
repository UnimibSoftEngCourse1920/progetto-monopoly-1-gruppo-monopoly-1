let Property = require('./Property');

class HouseProperty extends Property {
    constructor(id, name, cost, housePrices, houseBuildPrice, colour) {
        super(id, name, cost, housePrices[0]);
        this.houseBuildPrice = houseBuildPrice;
        this.houses = 0;
        this.housePrices = housePrices;
        this.colour = colour;
    }

    addHouse() {
        if (houses < 5) {
            houses++;
            rent = housePrices[houses];
            return true;
        }
        else
            return false;
    }

    removeHouse() {
        if (houses > 0) {
            houses--;
            rent = housePrices[houses];
            return true;
        }
        else
            return false;
    }

}

module.exports = HouseProperty;