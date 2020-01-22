class ServicesHandler extends PlayerHandler{
    constructor(player, diceTotal){
        super(player);
        this.diceTotal = diceTotal;
    }

    handle(){
        pos = player.getPos();
        square = squares[pos];
        owner = square.getOwner();
        mult = 0;
        rent = diceTotal;

        if(owner != null){ //controlla l'array services di player: se ne ha una, ritorna 4, altrimenti 10;
            if(owner.getId() != playerId){
                mult = checkServices(owner);
                console.log("this property is owned by " + owner.getName());
                if(square.getState() == 'active')
                    return mult;
                else{
                    console.log("you're lucky, this property is mortgaged");
                    return 0;
                }
            }
        }
        else{
            console.log("you landed on an unowned property");      
            return -1; //client decide se comprare o meno square
        }
    }

    checkServices(owner){
        count = 0;
        services = owner.getServices();
      
        for(let i=0; i<serices.length; i++){
         if(services[i] != null)
          count++;
        }
        if(count==1)
         return 4;
        return 10;
      }
}
