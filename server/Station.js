let Property = require('./Property');
let Player = require('./Player');
class Station extends Property {
    constructor(id, name, cost, rentPrices, cashBackCoins) {
        super(id, name, cost, rentPrices[0], cashBackCoins);
        this.rentPrices = rentPrices;
    }

}

module.exports = Station;
