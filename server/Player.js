//let Property = require('./Property');
//let HouseProperty = require('./HouseProperty');
//let Services = require('./Services');
//let Station = require('./Station');
//let Square = require('./Square');
class Player {
    constructor(socketId, id, name) {
      this.socketId = socketId;
        this.id = id;
        this.name = name;
        this.money = 1500;
        this.pos = 0;
        this.props = [];
        this.services = [];
        this.stations = [];
        this.jail = false;
        this.jailCount = 0;
        this.getOutOfJailFree = false;
    }

    updateJailCount(){
      this.jailCount++;
      return this.jailCount;
    }

    addProp(prop) {
        this.props.push(prop);
    }

    getId() {
      return this.id;
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

    updateMoney(delta) {
      let delta1 = delta*1;
        if (delta1 > 0) {
            this.money += delta1;
            return true;
        } else {
          let u = this.money + delta1;
          if (u < 0)
            return false;
          else {
            this.money += delta1;
            return true;
          }
        }
    }

    getServices() {
      return this.services;
    }

    getStations() {
      return this.stations;
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
            return 200;
          }
        else {
            this.setPos(sum);
            return 0;
        }
    }
 }


module.exports = Player;
