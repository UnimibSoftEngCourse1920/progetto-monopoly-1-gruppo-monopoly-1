class PayPlayerCard{
    constructor(amount, description) {
        this.amount = amount;
        this.description = description;
    }

    execute = function(player, players){
        player.updateMoney(-amount*players.length);
        for(let i=0; i < players.length; i++){
            if(players.getId() != players[i].getId())
                players[i].updateMoney(amount);
        }
        return -amount;
    }

    printDescription = function(){
        return this.description;
    }
}