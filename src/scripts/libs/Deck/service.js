import Constants from "../../constants.js";
import Aborter from "../Aborter/aborter.js";

const SHUFFLE = (deck_id) =>
    `https://deckofcardsapi.com/api/deck/${deck_id || "new"}/shuffle/?deck_count=1`;

const DRAW = (deck_id, count) =>
    `https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=${count}`;

export default function DeckService() {
    Aborter.set(Constants.ABORT_KEY_DRAW);
    Aborter.set(Constants.ABORT_KEY_SHUFFLE);
}

/**
 * @typedef {Object} ShufflePayload
 * @property {boolean} success
 * @property {string} deck_id
 * @property {boolean} shuffled
 * @property {number} remaining
 */

/**
 * Calls https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1.
 * If `deck_id` is provided, reshuffle the deck with new cards.
 * @param {string} deck_id
 * @param {number} count
 * @returns {Promise<ShufflePayload>}
 */
DeckService.prototype.shuffle = async function (deck_id) {
    try {
        const response = await fetch(SHUFFLE(deck_id), {
            signal: Aborter.getSignal(Constants.ABORT_KEY_SHUFFLE),
        });

        if (!response.ok) {
            throw new Error("DeckService.prototype.shuffle response not ok");
        }

        const payload = await response.json();

        if (!payload.success) {
            throw new Error("DeckService.prototype.shuffle success false");
        }

        return payload;
    } catch (error) {
        throw error;
    }
};

/**
 * @typedef {Object} DrawPayload
 * @property {boolean} success
 * @property {Card[]} cards
 * @property {string} deck_id
 * @property {number} remaining
 */

/**
 * Calls https://deckofcardsapi.com/api/deck/{deck_id}/draw/?count={count}.
 * @param {string} deck_id
 * @param {number} count
 * @returns {Promise<DrawPayload>}
 */
DeckService.prototype.draw = async function (deck_id, count) {
    try {
        const response = await fetch(DRAW(deck_id, count), {
            signal: Aborter.getSignal(Constants.ABORT_KEY_DRAW),
        });

        if (!response.ok) {
            throw new Error("DeckService.prototype.draw response not ok");
        }

        const payload = await response.json();

        if (!payload.success) {
            throw new Error("DeckService.prototype.shuffle success false");
        }

        return payload;
    } catch (error) {
        throw error;
    }
};
