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
  }
}

module.exports = Game;
