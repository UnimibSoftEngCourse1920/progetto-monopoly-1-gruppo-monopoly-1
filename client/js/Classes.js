class Player {
    constructor(id, name, pedina) {
        this.id = id;
        this.name = name;
        this.money = 1500;
        this.pos = 0;
        this.props = [];
        this.services = [];
        this.stations = [];
        this.pedina = pedina;
        this.getOutOfJailFree = false;
        this.numHouses = 0;
        this.coins = 0;
    }

    dicePos(diceNumber) {
      let sum;
        sum = this.pos + diceNumber;
        if (sum > 39)
            return sum - 40;
        else
            return sum;
    }

    addProp(prop) {
        this.props.push(prop);
    }
    removeProp(prop) {
        let stop = false
        for (let i = 0; i < this.props.length && !stop; i++) {
            if (this.props[i] == prop) {
                this.props.splice(i, 1);
                stop = true;
            }
        }
    }
    getPos() {
        return this.pos;
    }

    setPos(pos) {
        this.pos = pos;
    }

    updateMoney(delta) {
      let delta1 = delta*1;
        if (delta1 > 0) {
            this.money += delta1;
            return true;
        }
        else if (delta1 <= 0) {
            if ((this.money + delta1) < 0)
                return false;
            else {
                this.money += delta1;
                return true;
            }
        }
    }

    updateCoins(delta){
      let delta1 = delta*1;
      if (delta1 > 0) {
        this.coins += delta1;
        return true;
      } else {
      let u = this.coins + delta1;
      if (u < 0)
        return false;
      else {
        this.coins += delta1;
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
class House {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
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
        this.unmortgagePrice = this.mortgage + this.mortgagePercent;
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
        this.numHouses = 0;
        this.houseBuildWithCoins = this.houseBuildPrice/5;
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
