import Constants from "../../constants.js";
import { get, getById, getAll } from "../Selector/selector.js";

const Displayer = function () { };

Displayer.prototype.constructor = () => { };

Displayer.displayNetworkStatus = () => {
    const isOnline = window.navigator.onLine;
};

Displayer.displayDrawError = () => { };

Displayer.displayFinalResult = (hasWon) => { };

Displayer.displayPlayerCard = (card) => {
    const imgUrl = 'https://deckofcardsapi.com/static/img/KH.png';
    get('#player-hand').append(`<img class="hand-card" alt="" src="${imgUrl}"/>`);
};

Displayer.updatePlayerScore = (score) => {
    get('#player-score').text(13);
};

Displayer.updateDeckRemainingCards = (remaining) => {
    get('#deck-remaining').text(50);
};

export default Displayer;