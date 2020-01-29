class Game {
  constructor(){
    this.turn = -1;
    this.diceTotal = 0;
    this.dice1 = 0;
    this.dice2 = 0;
    this.doubleDice = 0;
    this.outcome = true;
    this.double = false;
    this.playerDisconnected = null;
  }
}

module.exports = Game;
