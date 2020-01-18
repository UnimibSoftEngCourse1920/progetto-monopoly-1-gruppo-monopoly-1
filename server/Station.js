import Property from 'http://localhost:1337/server/Property';

class Station extends Property {
    constructor(id, name, cost, rentPrices) {
        super(id, name, cost, rentPrices[0]);
        this.rentPrices = rentPrices;
    }
}

modules.exports = Station;