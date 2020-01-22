let Property = require('./server/Property');
let Services = require('./server/Services');
let Station = require('./server/Station');
let HouseProperty = require('./server/HouseProperty');
let Player = require('./server/Player');
let Square = require('./server/Square');
let Chance = require('./server/Chance');
let CommunityChest = require('./server/CommunityChest');
let IncomeTax = require('./server/IncomeTax');

let main = function(){
	let player = new Player(0, 0, "player 1");
	let square = new IncomeTax(38, 200);
	handlePlayer(player, square, null);
}

let handlePlayer = function(player, square, owner){
  console.log("eseguo hnadle");
  player.pos = 38;
 //setta la pos del player
  playerId = player.getId(); 
  //promemoria: handler per ogni tipo di square
  if(square instanceof HouseProperty || square instanceof Station){
	rent = square.getRent();
	console.log("istanza di House");
	if(owner != null){
	  if(owner.getId() != playerId){  
		console.log("this property is owned by " + owner.getName());
		if(square.getState() == 'active')
		  payRent(rent, player, owner);
		else
		  console.log("you're lucky, this property is mortgaged");
	  }
	  else
		console.log("you landed on a property of yours");
	}
	else{
	  console.log("you landed on an unowned property");      
	  //playerSocket.emit('unownedProperty'); //cliente decide se comprare o meno square
	}
  } 
  else if(square instanceof Services){
	  console.log("istanza di Services");
	mult = 0;
	rent = 12;

	if(owner != null){
	  mult = checkServices(owner); //controlla l'array services di player: se ne ha una, ritorna 4, altrimenti 10;
	  if(owner.getId() != playerId){
		console.log("this property is owned by " + owner.getName());
		if(square.getState() == 'active')
		  payRent(rent*mult, player, owner);
		else
		  console.log("you're lucky, this property is mortgaged");
	  }
	}
	else{
	  console.log("you landed on an unowned property");      
	  //playerSocket.emit('unownedProperty'); //client decide se comprare o meno square
	}
  }
  else if(square instanceof IncomeTax){
	tax = square.getTax();
	player.updateMoney(-tax);
	console.log(player.getName() + " ci ha perso " + tax + "e ora il suo patrimonio è " + player.money);
	console.log("paghi tasse!");
	//playerSocket.emit('payTax', tax);

	//for(let i = 0; i < socketList.length; i++){
	 // if(i != playerId) //per ora playerId = socket[playerId]
		//socketList[i].emit('changeView', playerId); //cambia il balance di player nell'HTML dei client
	//}
  }
  else if(square instanceof Chance){
	card = chance.getCard();
	console.log("probabilità!");
	//handler per le probabilità
  }
  else if(square instanceof CommunityChest){
	card = communityChest.getCard();
	console.log("imprevisti");
	//handler per gli imprevisti
  }
}

let checkServices = function(owner){
  count = 0;
  services = owner.getServices();

  for(let i=0; i<services.length; i++){
   if(services[i] != null)
    count++;
  }
  if(count==1)
   return 4;
  
  return 10;
}

let payRent = function(rent, player, owner){
  console.log("you must pay him " + rent);
  player.updateMoney(-rent);
  owner.updateMoney(rent);
  console.log(owner.getName() + " ci ha guadagnato " + rent + "e ora il suo patrimonio è " + owner.money);
  console.log(player.getName() + " ci ha perso " + rent + "e ora il suo patrimonio è " + player.money);
}

main();