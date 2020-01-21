class PayCard{
    constructor(description, amount) {
        this.description = description;
        this.amount = amount;
    }

    excecute = function(player){
        player.updateMoney(amount);
    }

    printDescription = function(){
        return this.description;
    }
}