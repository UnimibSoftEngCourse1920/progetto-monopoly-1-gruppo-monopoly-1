class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.money = 1500;
        this.pos = 0;
        this.props = [];
        this.services = [null, null];
    }

    addProp(prop) {
        this.props.push(prop);
    }

    getId() {
      return this.id;
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

    getServices() {
      return this.services;
    }

    getPos() {
        return this.pos;
    }

    setPos(pos) {
        this.pos = pos;
    }

    dicePos(diceNumber) {
      let  sum = this.pos + diceNumber;
        if (sum > 39) {
            this.setPos(sum - 40);
          }
        else {
            this.setPos(sum);
        }
    }
 }


module.exports = Player;
