let Property = require('./Property');
let Player = require('./Player');
class Services extends Property {
    constructor(id, name, cost, cashBackCoins) {
        super(id, name, cost, 0, cashBackCoins);
    }
}

module.exports = Services;
