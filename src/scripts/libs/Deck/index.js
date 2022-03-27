import Card from "../Card/index.js";
import DeckService from "./service.js";

export default function Deck() {
    this.deckService = new DeckService();
    /**
     * @type {string}
     */
    this.deck_id = null;

    /**
     * @type {number}
     */
    this.remaining = 52;

    /**
     * @type {Card}
     */
    this.poppedCard = null;
}

/**
 * Creates a Deck instance from a regular object
 * @returns {Deck}
 */
Deck.create = (data) => {
    const instance = new Deck();

    instance.deck_id = data.deck_id;
    instance.remaining = data.remaining;
    instance.poppedCard = data.poppedCard ? new Card(data.poppedCard) : null;

    return instance;
};

/**
 * Shuffles the deck.
 */
Deck.prototype.shuffle = async function () {
    try {
        const { deck_id, remaining } = await this.deckService.shuffle();
        this.deck_id = deck_id;
        this.remaining = remaining;
        this.poppedCard = null;
    } catch (error) {
        throw error;
    }
};

/**
 * Reshuffles the deck with new cards.
 */
Deck.prototype.reshuffle = async function () {
    try {
        const { remaining } = await this.deckService.shuffle(this.deck_id);
        this.remaining = remaining;
        this.poppedCard = null;
    } catch (error) {
        throw error;
    }
};

/**
 * Draws a card from the deck.
 * @param {number} count
 * @returns {Promise<Card>}
 */
Deck.prototype.draw = async function (count = 1) {
    try {
        const { cards, remaining } = await this.deckService.draw(this.deck_id, count);
        const [card] = cards;
        this.remaining = remaining;
        return new Card(card);
    } catch (error) {
        throw error;
    }
};

/**
 * Get the top card of the deck.
 *
 * @returns {Promise<Card>}
 */
Deck.prototype.pop = async function () {
    try {
        this.poppedCard = await this.draw(1);
        this.remaining++;
        return this.poppedCard;
    } catch (error) {
        throw error;
    }
};

/**
 * Checks wether the deck is set or not
 */
Deck.prototype.isAlreadySet = function () {
    return this.deck_id !== null;
};

/**
 * Checks if the deck is empty
 */
Deck.prototype.isEmpty = function () {
    return this.remaining === 0;
};

Deck.prototype[Symbol.asyncIterator] = async function* () {
    for (let i = this.remaining; i > 0; i--) {
        yield this.draw();
    }
};
