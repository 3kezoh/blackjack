import Constants from "../../constants.js";
import Card from "../Card/index.js";
import { get, getAll, getById } from "../Selector/selector.js";

let errorTimeout = null;

/**
 * @class
 */
const Displayer = function () {};

Displayer.displayNetworkStatus = () => {
    const isOnline = window.navigator.onLine;

    getById(`#wifi-${isOnline ? "on" : "off"}`).show();
    getById(`#wifi-${isOnline ? "off" : "on"}`).hide();
};

Displayer.displayErrorMessage = (message) => {
    clearTimeout(errorTimeout);

    getById("error-message").text(message);
    get(".error").show();

    errorTimeout = setTimeout(() => get(".error").hide(), 2000);
};

Displayer.displayEndgame = (hasWon, nextCard = null) => {
    get(".bj-actions").hidden();
    if (hasWon) {
        Displayer.animateWinningCards();
        getById("action-replay").text("Play again");
        get(".modal-content").html(
            nextCard ? getModalContentNextCard(nextCard) : getModalContentAutoWin()
        );
    } else {
        Displayer.animateLoosingCards();
        getById("action-replay").text("Try again");
        get(".modal-content").html(
            nextCard ? getModalContentNextCard(nextCard) : getModalContentAutoLoose()
        );
    }
    get(".modal-title").html(getModalTitle(hasWon));

    setTimeout(() => {
        get(".bj-final-modal").addClass("active").show();
    }, Constants.MODAL_DISPLAY_DELAY * 1000);
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

Displayer.handleDrawStart = () => {
    getById("#action-hit").attr("disabled", true);
    getById("#action-stand").attr("disabled", true);
};

Displayer.handleDrawEnd = () => {
    getById("#action-hit").removeAttr("disabled");
    getById("#action-restart").visible();
    getById("#action-stand").removeAttr("disabled");
};

Displayer.handleStandEvent = () => {
    get(".bj-actions").hidden();
};

Displayer.handleStartEvent = () => {
    getById("#action-stand").attr("disabled", true);
    getById("#action-stop").visible();
    get(".bj-scoreboard").visible();
    get(".bj-actions").visible();
    get(".deck-container").removeClass("initial-center");
    get(".bj-final-modal").removeClass("active").hide();
};

Displayer.handleStopEvent = () => {
    getById("#player-hand").html("");
    getById("#action-stop").hidden();
    getById("#action-restart").hidden();
    get(".bj-scoreboard").hidden();
    get(".bj-actions").hidden();
    get(".deck-container").addClass("initial-center");
    get(".bj-final-modal").removeClass("active").hide();
    get(".endgame").hide();
};

Displayer.animateWinningCards = () => {
    const cards = getAll(".hand-card");

    const keyframes = [
        { transform: "rotateY(0deg) rotate(0deg)", marginLeft: "-50px" },
        { transform: "rotateY(180deg) rotate(-25deg)", marginLeft: "-118px" },
        { transform: "rotateY(0deg) rotate(-25deg)", marginLeft: "-200px" },
        { transform: "rotateY(-180deg) rotate(-25deg)", marginLeft: "-118px" },
        { transform: "rotateY(0deg) rotate(0deg)", marginLeft: "-50px" },
    ];

    const timings = {
        easing: "linear",
        duration: 1750,
        iterations: 2,
    };

    let delay = 0;
    const animations = [];
    for (let card of cards) {
        timings.delay = delay;
        delay += 50;
        animations.push(card.animate(keyframes, timings));
    }

    const interval = setInterval(() => {
        // Auto clear interval when there is no more cards (game stopped or restarted)
        if (getById("player-hand").html() === "") {
            return clearInterval(interval);
        }
        animations.forEach((animation) => {
            animation.play();
        });
    }, Constants.WINNING_CARDS_DELAY * 1000);
};

Displayer.animateLoosingCards = () => {
    const cards = getAll(".hand-card");

    const keyframes = [
        { transform: "translateY(0px)" },
        { transform: "translateY(-15px)" },
        { transform: "translateY(0px)" },
    ];
    const timings = {
        easing: "linear",
        duration: 250,
        iterations: 5,
    };

    let delay = 0;
    const animations = [];
    for (let card of cards) {
        timings.delay = delay;
        delay += 40;
        animations.push(card.animate(keyframes, timings));
    }

    const interval = setInterval(() => {
        // Auto clear interval when there is no more cards (game stopped or restarted)
        if (getById("player-hand").html() === "") {
            return clearInterval(interval);
        }
        animations.forEach((animation) => {
            animation.play();
        });
    }, Constants.LOOSING_CARDS_DELAY * 1000);
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
