import Property from 'http://localhost:1337/server/Property';

class Services extends Property {
    constructor(id, name, cost) {
        super(id, name, cost, 0);
    }
}

modules.exports = Services;