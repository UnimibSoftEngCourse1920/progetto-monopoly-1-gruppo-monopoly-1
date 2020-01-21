class PayPerBuildingCard{
    constructor(amountPerHouse, amountPerHotel, description) {
        this.amountPerHouse = amountPerHouse;
        this.amountPerHotel = amountPerHotel;
        this.description = description;
    }

    excecute = function(player){
        total = 0;
        props = player.getProps();

        for(let i=0; i<props.length; i++){
            if(props[i] instanceof HouseProperty)
                if(props[i].getHouses() == 5)
                    total += amountPerHotel;
                else
                    total += amountPerHouse*props[i].getHouses();
        }
        player.updateMoney(-total);
        return -total;
    }

    printDescription = function(){
        return this.description;
    }
}