class Player {
    constructor(id) {
        this.id = id;
        this.money = 1500;
        this.pos = 0;
        this.props = [];
    }

    addProp(prop) {
        this.props.push(prop);
    }

    removeProp(prop) {
        stop = false
        for (i = 0; i < props.length && !stop; i++) {
            if (props[i] == prop) {
                this.props.delete(props[i]);
                stop = true;
            }
        }
    }

    updateMoney(delta) {
        if (delta > 0) {
            this.money += delta;
            return true;
        }
        else if (delta <= 0) {
            if ((this.money + delta) < 0)
                return false;
            else {
                this.money += delta;
                return true;
            }
        }
    }

    get pos() {
        return this.pos;
    } 

    set pos(pos) {
        this.pos = pos;
    }

    dicePos(diceNumber) {
        sum = this.pos + diceNumber;
        if (sum > 39)
            pos(sum - 40);
        else
            pos(sum);
    }
}

class Property {
    constructor(id, name, cost, rent) {
        this.id = id;
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

class HouseProperty extends Property {
    constructor(id, name, cost, housePrices, colour) {
        super(id, name, cost, housePrices[0]);
        this.housePrice = housePrice;
        this.houses = 0;
        this.housePrices = housePrices;
        this.colour = colour;
    }

    addHouse() {
        if (houses < 5) {
            houses++;
            rent = housePrices[houses];
            return true;
        }
        else
            return false;
    }

    removeHouse() {
        if (houses > 0) {
            houses--;
            rent = housePrices[houses];
            return true;
        }
        else
            return false;
    }

}

class Station {
    constructor(id, name, cost, rentPrices) {
        super(id, name, cost, rentPrices[0]);
        this.rentPrices = rentPrices;
    }
}

class Services {
    constructor(id, name, cost, rentPrices) {
        super(id, name, cost, rentPrices[0]);
        this.rentPrices = rentPrices;
    }
}

modules.exports = Player;
modules.exports = Property;
modules.exports = HouseProperty;
modules.exports = Station;
modules.exports = Services;