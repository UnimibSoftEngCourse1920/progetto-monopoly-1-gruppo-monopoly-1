let Card = require('./Card');
class PayPlayerCard extends Card{
    constructor(amount, boo, description) {
      super(description);
        this.amount = amount;
        this.boo = boo;
    }

    execute = function(){
      return this.amount;
    }

    printDescription = function(){
        return this.description;
    }
}

module.exports = PayPlayerCard;
