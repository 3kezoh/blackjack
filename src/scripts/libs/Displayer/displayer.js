import Constants from "../../constants.js";
import Card from "../Card/index.js";
import { get, getAll, getById } from "../Selector/selector.js";

let errorTimeout = null;

/**
 * @class
 */
const Displayer = function () {};

Displayer.displayNetworkStatus = () => {
    const { onLine } = window.navigator;

    getById(`#wifi-${onLine ? "on" : "off"}`).show();
    getById(`#wifi-${onLine ? "off" : "on"}`).hide();
};

Displayer.displayErrorMessage = (message) => {
    clearTimeout(errorTimeout);

    getById("error-message").text(message);
    get(".error").show();
    navigator.vibrate(500);
    errorTimeout = setTimeout(() => get(".error").hide(), 2000);
};

Displayer.displayEndgame = (hasWon, nextCard = null) => {
    get(".bj-actions").hidden();
    if (hasWon) {
        navigator.vibrate([100, 100, 250]);
        Displayer.animateWinningCards();
        getById("action-replay").text("Play again");
        get(".modal-content").html(
            nextCard ? getModalContentNextCard(nextCard) : getModalContentAutoWin()
        );
    } else {
        navigator.vibrate([250, 500]);
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
 * @param {number} remaining
 */
Displayer.displayDeck = (remaining) => {
    const { elements } = getById("deck");
    const [deckElement] = elements;

    const documentFragment = document.createDocumentFragment();

    for (let i = 0; i < remaining; i++) {
        const cardElement = document.createElement("li");

        cardElement.dataset.x = -i / 3;
        cardElement.dataset.y = -i / 4;

        cardElement.classList.add("card");
        cardElement.style.zIndex = i;
        cardElement.style.transform = `translate(${cardElement.dataset.x}px, ${cardElement.dataset.y}px)`;

        documentFragment.appendChild(cardElement);
    }

    deckElement.appendChild(documentFragment);
};

/**
 * Shuffles the deck
 * Can be slow
 * @return {Promise<Promise<Animation>[]>}
 */
Displayer.shuffleDeck = async function () {
    const { elements: cardElements } = getAll(".card");

    const promises = cardElements.map(async (cardElement, i) => {
        const x = parseFloat(cardElement.dataset.x);
        const y = parseFloat(cardElement.dataset.y);

        let offsetX = cardElement.clientWidth / 2 + (cardElement.clientWidth / 2) * Math.random();
        let offsetY = -i * (1 / 8);

        if (Math.random() < 0.5) {
            offsetX = -offsetX;
        }

        const shuffleDeckKeyframes = {
            transform: [
                `translate(${x}px, ${y}px)`,
                `translate(${x + offsetX}px, ${y + offsetY}px)`,
                `translate(${x}px, ${y}px)`,
                `translate(${x}px, ${y}px)`,
                `translate(${x - offsetX}px, ${y + offsetY}px)`,
                `translate(${x}px, ${y}px)`,
            ],
        };

        const shuffleDeckAnimation = cardElement.animate(shuffleDeckKeyframes, {
            duration: 900,
            delay: i * 3,
            ease: "ease-in-out",
        });

        return shuffleDeckAnimation.finished;
    });

    return Promise.all(promises);
};

/**
 * Draw a card from the deck and show it
 * TODO refactor
 * @param {Card} card
 * @return {Promise<Animation>}
 */
Displayer.drawCard = async function (card) {
    const deckElement = document.getElementById("deck");

    const lastCardElement = deckElement.lastElementChild;

    const x = parseFloat(lastCardElement.dataset.x);
    const y = parseFloat(lastCardElement.dataset.y);

    const drawCardKeyframes = {
        transform: [`translate(${x}px, ${y}px)`, `translate(${x}px, ${y + 118.75 / 2}px)`],
        opacity: [1, 0],
    };

    const drawCardAnimation = lastCardElement.animate(drawCardKeyframes, 300);

    await drawCardAnimation.finished;

    deckElement.removeChild(deckElement.lastChild);

    return this.displayPlayerCard(card);
};

/**
 * Display a card in the player's hand
 * @param {Card} card
 * @return {Promise<Animation>}
 */
Displayer.displayPlayerCard = async function ({ image }) {
    const handElement = document.getElementById("hand");

    const cardImage = new Image();

    cardImage.src = image;
    cardImage.alt = `${image.slice(-6, -4)} Card`;
    cardImage.classList.add("card");

    handElement.appendChild(cardImage);

    const addCardToHandKeyframes = {
        transform: [`translateY(${cardImage.clientHeight / 2}px)`, "translateY(0)"],
        opacity: [0, 1],
    };

    const addCardToHandAnimation = cardImage.animate(addCardToHandKeyframes, 300);

    return addCardToHandAnimation.finished;
};

Displayer.updatePlayerScore = (score) => {
    get("#player-score").text(score);
};

Displayer.updateDeckRemainingCards = (remaining) => {
    get("#deck-remaining").text(remaining);
};

Displayer.handleDrawStart = () => {
    navigator.vibrate(250);
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
    get(".main-board").removeClass("init");
    get(".bj-final-modal").removeClass("active").hide();
};

Displayer.handleStopEvent = () => {
    getById("hand").html("");
    getById("#action-stop").hidden();
    getById("#action-restart").hidden();
    get(".bj-scoreboard").hidden();
    get(".bj-actions").hidden();
    get(".main-board").addClass("init");
    get(".bj-final-modal").removeClass("active").hide();
    get(".endgame").hide();
};

Displayer.animateWinningCards = () => {
    const cards = getAll("#hand .card");

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
        if (getById("hand").html() === "") {
            return clearInterval(interval);
        }
        animations.forEach((animation) => {
            animation.play();
        });
    }, Constants.WINNING_CARDS_DELAY * 1000);
};

Displayer.animateLoosingCards = () => {
    const cards = getAll("#hand .card");

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
        if (getById("hand").html() === "") {
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
