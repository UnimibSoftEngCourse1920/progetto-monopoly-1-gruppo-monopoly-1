let Property = require('./Property');
let Player = require('./Player');
class Station extends Property {
    constructor(id, name, cost, rentPrices) {
        super(id, name, cost, rentPrices[0]);
        this.rentPrices = rentPrices;
    }

}

module.exports = Station;
