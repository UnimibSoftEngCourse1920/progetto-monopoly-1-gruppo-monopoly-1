class PayPlayerCard{
    constructor(amount, description) {
        this.amount = amount;
        this.description = description;
    }

    excecute = function(player, players){
        player.updateMoney(-amount*players.length);
        for(let i=0; i < players.length; i++){
            if(player.getId() != player[i].getId())
                player[i].updateMoney(amount);
        }
    }

    printDescription = function(){
        return this.description;
    }
}