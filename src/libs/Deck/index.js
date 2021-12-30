import DeckService from "./service.js";

export default function Deck() {
  this.deckService = new DeckService();
  this.deck_id = null;
  this.remaining = 0;
}

Deck.prototype.shuffle = async function () {
  const { deck_id, remaining } = await this.deckService.shuffle();
  this.deck_id = deck_id;
  this.remaining = remaining;
};

Deck.prototype.reshuffle = async function () {
  if (this.deck_id) {
    const { remaining } = await this.deckService.shuffle(this.deck_id);
    this.remaining = remaining;
  }
};

Deck.prototype.draw = async function () {
  const { cards, remaining } = await this.deckService.draw(this.deck_id, 1);
  this.remaining = remaining;
  return cards[0];
};

Deck.prototype[Symbol.asyncIterator] = async function* () {
  for (let i = this.remaining; i > 0; i--) {
    yield this.draw();
  }
};
