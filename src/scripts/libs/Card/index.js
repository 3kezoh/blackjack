/**
 * Represents a card.
 * @param {Object} card
 * @param {string} card.value
 * @param {string} card.code
 * @param {string} card.image
 * @param {string} card.suit
 */
export default function Card({ value, code, image, suit }) {
    /**
     * @type {string}
     */
    this.code = code;

    /**
     * @type {string}
     */
    this.image = image;

    /**
     * @type {string}
     */
    this.value = value;

    /**
     * @type {string}
     */
    this.suit = suit;

    /**
     * @type {boolean}
     */
    this.isFlipped = false;
}

/**
 * Creates a Card instance from a regular object
 * @returns {Card}
 */
Card.create = (data) => {
    const instance = new Card(data);
    instance.isFlipped = data.isFlipped;

    return instance;
};

/**
 * Flip a card.
 */
Card.prototype.flip = function () {
    this.isFlipped = !this.isFlipped;
};
