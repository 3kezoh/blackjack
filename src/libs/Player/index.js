export default function Player() {
  this.hand = [];
  this.score = 0;
}

Player.prototype.draw = function (card) {
  this.hand.push(card);
  this.score += Number.parseInt(card.value);
};

Player.prototype[Symbol.iterator] = function* () {
  for (const card of this.hand) {
    yield card;
  }
};
