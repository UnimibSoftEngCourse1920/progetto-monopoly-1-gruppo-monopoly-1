class Game {
  constructor(level){
    this.turn = -1;
    this.diceTotal = 0;
    this.dice1 = 0;
    this.dice2 = 0;
    this.doubleDice = 0;
    this.outcome = true;
    this.double = false;
    this.playerDisconnected = null;
    this.level = level;
    this.totalTurns = 0;
    this.propAuction = null;
    this.highestBid = 0;
    this.bidder = null;
    this.bid = 0;
    this.ended = false;
  }
}

module.exports = Game;
