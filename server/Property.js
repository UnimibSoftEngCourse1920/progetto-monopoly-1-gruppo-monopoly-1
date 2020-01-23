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
        this.owner = null;
        this.state = 'active';
    }

    mortgaged() {
        this.state = 'mortgaged';
    }

    setRent(rent){
        this.rent = rent; //lo sposterei dentro alle classi specializzate
    }

    getRent(){
        return this.rent;
    }

    unmortgaged() {
        this.state = 'active';
    }

    setOwner(owner){
        this.owner = owner;
    }

    getOwner(){
        return this.owner;
    }

    getState(){
        return this.state;
    }
}

module.exports = Property;