import DeckService from "./service.js";
import Card from "../Card/index.js";

export default function Deck() {
  this.deckService = new DeckService();
  /**
   * @type {string}
   */
  this.deck_id = null;

  /**
   * @type {number}
   */
  this.remaining = 0;
}

/**
 * Shuffles the deck.
 */
Deck.prototype.shuffle = async function () {
  const { deck_id, remaining } = await this.deckService.shuffle();
  this.deck_id = deck_id;
  this.remaining = remaining;
};

/**
 * Reshuffles the deck with new cards.
 */
Deck.prototype.reshuffle = async function () {
  if (this.deck_id) {
    const { remaining } = await this.deckService.shuffle(this.deck_id);
    this.remaining = remaining;
  }
};

/**
 * Draws a card from the deck.
 * @returns {Promise<Card>}
 */
Deck.prototype.draw = async function () {
  const { cards, remaining } = await this.deckService.draw(this.deck_id, 1);
  const [card] = cards;
  this.remaining = remaining;
  return new Card(card);
};

Deck.prototype[Symbol.asyncIterator] = async function* () {
  for (let i = this.remaining; i > 0; i--) {
    yield this.draw();
  }
};
