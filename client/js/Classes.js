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
