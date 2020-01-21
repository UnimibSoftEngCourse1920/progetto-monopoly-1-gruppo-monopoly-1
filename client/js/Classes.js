class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.money = 1500;
        this.pos = 0;
        this.props = [];
    }

    dicePos(diceNumber) {
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
