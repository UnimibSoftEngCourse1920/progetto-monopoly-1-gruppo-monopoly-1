import Square from 'http://localhost:1337/server/Square';

class Property extends Square {
    constructor(id, name, cost, rent) {
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

    get rent() {
        return this.rent;
    }

    set rent(rent) {
        this.rent = rent;
    }

    unmortgage() {
        this.state = 'active';
    }
}

modules.exports = Property;