export default function Player() {
  /**
   * @type {Card[]}
   */
  this.hand = [];

  /**
   * @type {number}
   */
  this.score = 0;
}

/**
 * Add a card to the player hand.
 * @param {Card} card
 */
Player.prototype.draw = function (card) {
  this.hand.push(card);
  this.score += Number.parseInt(card.value);
};

Player.prototype[Symbol.iterator] = function* () {
  for (const card of this.hand) {
    yield card;
  }
};
