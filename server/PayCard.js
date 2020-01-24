let Card = require('./Card');
class PayCard extends Card{
    constructor(description, amount) {
        super(description);
        this.amount = amount;
    }

    execute(){
        return amount;
    }

    printDescription(){
        return this.description;
    }
}

module.exports = PayCard;
