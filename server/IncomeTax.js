let Square = require('./Square');

class IncomeTax extends Square {
    constructor(id, tax) {
        super(id);
        this.tax = tax;
    }

    getTax(){
        return this.tax;
    }
}

module.exports = IncomeTax;