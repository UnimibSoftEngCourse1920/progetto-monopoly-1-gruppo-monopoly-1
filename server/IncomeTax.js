import Square from 'http://localhost:1337/server/Square';

class IncomeTax extends Square {
    constructor(id, tax) {
        super(id);
        this.tax = tax;
    }
}

modules.exports = IncomeTax;