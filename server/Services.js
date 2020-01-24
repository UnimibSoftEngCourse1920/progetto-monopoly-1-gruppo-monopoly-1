let Property = require('./Property');
let Player = require('./Player');
class Services extends Property {
    constructor(id, name, cost) {
        super(id, name, cost, 0);
    }
}

module.exports = Services;
