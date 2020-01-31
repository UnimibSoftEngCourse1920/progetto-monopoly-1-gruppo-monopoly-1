let Square = require('./Square');
let Player = require('./Player');
class Property extends Square {
    constructor(id, name, cost, rent, cashBackCoins) {
        super(id);
        this.name = name;
        this.cost = cost;
        this.mortgage = cost / 2;
        this.mortgagePercent = 0.1 * this.mortgage;
        this.unmortgagePrice = this.mortgage + this.mortgagePercent;
        this.rent = rent;
        this.state = 'active';
        this.owner = -1;
        this.cashBackCoins = cashBackCoins;
    }

    setOwner(owner) {
      this.owner = owner;
    }

    getOwner() {
      return this.owner;
    }

    mortgaged() {
        this.state = 'mortgaged';
        return this.mortgage;
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
