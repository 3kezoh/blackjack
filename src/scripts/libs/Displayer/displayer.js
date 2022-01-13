import Card from "../Card/index.js";
import { get, getById } from "../Selector/selector.js";

const Displayer = function () {};

Displayer.displayNetworkStatus = () => {
    const isOnline = window.navigator.onLine;
    const path = `images/wifi-${isOnline ? "on" : "off"}.svg`;
    get("#wifi > img.toolbar-icon").attr("src", path);
    get("#wifi > span.tooltip-content").text(isOnline ? "Online" : "Offline");
};

Displayer.displayDrawError = () => {};

Displayer.displayFinalResult = (hasWon) => {};

/**
 * @param {Card} card
 */
Displayer.displayPlayerCard = ({ image }) => {
    get("#player-hand").append(`<img class="hand-card" alt="" src="${image}"/>`);
};

Displayer.updatePlayerScore = (score) => {
    get("#player-score").text(score);
};

Displayer.updateDeckRemainingCards = (remaining) => {
    get("#deck-remaining").text(remaining);
};

Displayer.displayDrawScene = () => {
    getById("#action-restart").removeClass("hidden");
    getById("#action-stand").removeAttr("disabled");
};

Displayer.displayStandScene = () => {
    get(".bj-actions").addClass("hidden");
};

export default Displayer;
