let Card = require('./Card');
class PayPlayerCard extends Card{
    constructor(amount, boo, description) {
      super(description);
        this.amount = amount;
        this.boo = boo;
    }

    execute = function(){
      return amount;
    }

    printDescription = function(){
        return this.description;
    }
}

module.exports = PayPlayerCard;
