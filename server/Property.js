let Square = require('./Square');
let Player = require('./server/Player');
class Property extends Square {
    constructor(id, name, cost, rent, mortgage) {
        super(id);
        this.name = name;
        this.cost = cost;
        this.mortgage = cost / 2;
        this.mortgagePercent = 0.1 * mortgage;
        this.unmortagePrice = this.mortgage + this.mortgagePercent;
        this.rent = rent;
        this.state = 'active';
        this.owner = null;
    }

    setOwner(owner) {
      this.owner = owner;
    }

    getOwner() {
      return this.owner;
    }

    mortgaged() {
        this.state = 'mortgaged';
    }

    getRent() {
        return this.rent;
    }

    setRent(rent) {
        this.rent = rent;
    }

    unmortgaged() {
        this.state = 'active';
    }
}

module.exports = Property;
