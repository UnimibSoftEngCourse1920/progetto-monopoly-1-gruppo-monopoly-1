class Deck {
    constructor(chance) {
        this.cards = [];
		if (!chance) {
			this.cards[0] = new PayCard("Bank error in your favor - collect $200", 200);
			this.cards[1] = new PayCard("Doctor's fee - pay $50", -50);
			this.cards[2] = new PayCard("Income Tax Refund - collect $20", 20);
			this.cards[3] = new PayCard("Life Insurance matures - collect $100", 100);
			this.cards[4] = new PayCard("Pay Hospital fees - pay $50", -50);
			this.cards[5] = new PayCard("Pay School tax - pay $50", -50);
			this.cards[6] = new PayCard("Receive $25 consultancy fee", 25);
			this.cards[7] = new PayCard("You win 2nd place in a beauty contest - collect $10", 10);
			this.cards[8] = new PayCard("You inherit $100", 100);
			this.cards[9] = new PayCard("From sale of stock you earn 50$", 50);
			this.cards[10] = new PayCard("Holiday fund matures - collect 100$", 100);
			this.cards[11] = new PayPerBuildingCard(45, 115, "You are assessed for street repairs � $40 per house, $115 per hotel");
			this.cards[12] = new PayPlayerCard(50, false, "Grand Opera Night - collect 50$ from each player");
			this.cards[13] = new GetOutOfJailCard("Get out of jail free � this card may be kept until needed, or sold");
			this.cards[14] = new GoToJailCard("Go to jail � go directly to jail � Do not pass Go, do not collect $200 ");
			this.cards[15] = new GoToCard("Advance to Go, Collect 200$", 0);
		}
		else {
			this.cards[0] = new GetOutOfJailCard("Get out of jail free � this card may be kept until needed, or sold");
			this.cards[1] = new GoToCard("Advance to Go, Collect 200$", 0);
			this.cards[2] = new GoToCard("Advance to Illinois Avenue, collect 200 if you pass go", 24);
			this.cards[3] = new GoToCard("Advance to St. Charles Place, collect 200 if you pass go", 11);
			this.cards[4] = new PayCard("Bank pays you dividend of $50 ", 50);
			this.cards[5] = new MoveBackCard(3, "Go back 3 spaces");
			this.cards[6] = new GoToJailCard("Go to jail � go directly to jail � Do not pass Go, do not collect $200 ");
			this.cards[7] = new PayPerBuildingCard(25, 100, "Make general repairs on all your property � $25 per house, $100 per hotel");
			this.cards[8] = new PayCard("Pay poor tax of $15 ", -15);
			this.cards[9] = new GoToCard("Take a trip to Reading Railroad, if you pass go collect 200", 5);
			this.cards[10] = new GoToCard("Advance to Boardwalk", 39);
			this.cards[11] = new PayPlayerCard(50, true, "You have been elected chairman of the board - pay 50$ to each player");
			this.cards[12] = new PayCard("Your building loan matures - collect $150", 150);
			this.cards[13] = new CloseServicesCard("Advance token to nearest Utility, if unowned you may buy it, if owned throw dice and pay owner 10 times the amount thrown");
			this.cards[14] = new CloseStationCard("Advance token to the nearest Railroad and pay owner twice the rent if owned, if unowned you may buy it");
			this.cards[15] = new PayCard("You have won a crossword competition collect 100", 100);
		}
		this.shuffle(cards);
		this.currentCard = 0;
		this.total = 16;
	}

	shuffle = function(a) {
		let j, x, i;
		for (i = a.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			x = a[i];
			a[i] = a[j];
			a[j] = x;
		}
		return a;
	}

	getCard = function () {
		temp = cards[currentCard];
		currentCard++;
		if (currentCard == total) {
			shuffle(cards);
			currentCard = 0;
		}
		return temp;
	}
}