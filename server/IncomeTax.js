let Square = require('./Square');

class IncomeTax extends Square {
    constructor(id, tax) {
        super(id);
        this.tax = tax;
    }
}

module.exports = IncomeTax;