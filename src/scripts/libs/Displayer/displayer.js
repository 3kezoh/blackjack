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

Displayer.displayFinalResult = (hasWon, nextCard = null) => {
    get(".bj-actions").hidden();
    getById("action-replay").text(hasWon ? "Play again" : "Try again");

    get(".modal-title").html(getModalTitle(hasWon));
    if (nextCard) {
        get(".modal-content").html(getModalContentNextCard(nextCard));
    } else {
        get(".modal-content").html(hasWon ? getModalContentAutoWin() : getModalContentAutoLoose());
    }

    get(".bj-final-modal").addClass("active").show();
};

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
    getById("#action-restart").visible();
    getById("#action-stand").removeAttr("disabled");
};

Displayer.displayStandScene = () => {
    get(".bj-actions").hidden();
};

const getModalTitle = (hasWon) =>
    hasWon
        ? `<h1>
                <img class="modal-icon" src="images/cup.svg" alt="" />
                <label>You won</label>
                <img class="modal-icon" src="images/cup.svg" alt="" />
            </h1>`
        : `<h1>
                <img class="modal-icon" src="images/sad.svg" alt="" />
                <label>You lost</label>
                <img class="modal-icon" src="images/sad.svg" alt="" />
            </h1>`;

const getModalContentAutoWin = () =>
    `<div id="modal-auto-win" class="modal-auto-win">
        <p>Perfect strike ! Lucky day</p>
    </div>`;

const getModalContentAutoLoose = () =>
    `<div id="modal-auto-loose" class="modal-auto-loose">
        <p>
            Oops, looks like you were too greedy...
            <img class="modal-icon" src="images/sad.svg" alt="" />
        </p>
    </div>`;

const getModalContentNextCard = ({ image, currentScore, value }) =>
    `<div id="modal-next-card" class="modal-next-card">
        <p>The next card is</p>
        <img class="modal-card" alt="" src="${image}" />
    </div>
    <div id="modal-final-score" class="modal-final-score">
        <p>Your final score is</p>
        <h2 id="final-score">${currentScore + value}</h2>
    </div>`;

export default Displayer;
