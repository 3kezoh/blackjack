import Card from "../Card/index.js";

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
 * Creates a Player instance from a regular object
 * @returns {Player}
 */
Player.create = data => {
  const instance = new Player();

  instance.score = data.score;
  for (const card of data.hand) {
    instance.hand.push(Card.create(card));
  }

  return instance;
};

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
