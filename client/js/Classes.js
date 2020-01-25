class Player {
    constructor(id, name, pedina) {
        this.id = id;
        this.name = name;
        this.money = 1500;
        this.pos = 0;
        this.props = [];
        this.pedina = pedina;
    }

    dicePos(diceNumber) {
      let sum;
        sum = this.pos + diceNumber;
        if (sum > 39)
            return sum - 40;
        else
            return sum;
    }

    getPos() {
        return this.pos;
    }

    setPos(pos) {
        this.pos = pos;
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

}

class Casella {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }
}
class Pedina {
  constructor(color) {
    this.color = color;
    this.w = 0;
    this.h = 0;
  }
  setDimensions(w,h) {
    this.w = w;
    this.h = h;
  }
}
class Coordinates {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Square {
    constructor(id) {
        this.id = id;
    }
}
class Property extends Square {
    constructor(id, name, cost, rent) {
        super(id);
        this.name = name;
        this.cost = cost;
        this.mortgage = cost / 2;
        this.mortgagePercent = 0.1 * this.mortgage;
        this.unmortagePrice = this.mortgage + this.mortgagePercent;
        this.rent = rent;
        this.state = 'active';
        this.owner = null;
    }
}

class HouseProperty extends Property {
    constructor(id, name, cost, housePrices, houseBuildPrice, colour) {
        super(id, name, cost, housePrices[0]);
        this.houseBuildPrice = houseBuildPrice;
        this.houses = 0;
        this.housePrices = housePrices;
        this.colour = colour;
    }
}

class Station extends Property {
    constructor(id, name, cost, rentPrices) {
        super(id, name, cost, rentPrices[0]);
        this.rentPrices = rentPrices;
    }

}

class Services extends Property {
    constructor(id, name, cost) {
        super(id, name, cost, 0);
    }
}
