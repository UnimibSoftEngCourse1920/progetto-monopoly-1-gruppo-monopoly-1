class Player {
    constructor(id, socket, name) {
        this.id = id;
        this.socket = socket;
        this.name = name;
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

    /*set pos(pos) {
        this.pos = pos;
    }*/

    dicePos(diceNumber) {
        sum = this.pos + diceNumber;
        if (sum > 39)
            pos(sum - 40);
        else
            pos(sum);
    }
}

module.exports = Player;