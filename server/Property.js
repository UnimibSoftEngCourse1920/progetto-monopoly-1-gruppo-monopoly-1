let Square = require('./Square');

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
    }

    mortgage() {
        this.state = 'mortgaged';
    }

    getRent() {
        return this.rent;
    }

    setRent(rent) {
        this.rent = rent;
    }

    unmortgage() {
        this.state = 'active';
    }
}

module.exports = Property;