import Deck from "../Deck/index.js";
import Player from "../Player/index.js";
import Constants from "../../constants.js";
import Displayer from "../Displayer/displayer.js";
import Card from "../Card/index.js";
import { clearSelectorEvents, get, getById } from "../Selector/selector.js";

const Game = function () {
    this.deck = new Deck();
    this.player = new Player();
    this.status = Constants.GAME_STATUS_READY;
};

Game.create = (data) => {
    const instance = new Game();

    instance.deck = Deck.create(data.deck);
    instance.player = Player.create(data.player);
    instance.status = data.status;

    return instance;
};

Game.prototype.init = async function () {
    setIntervalCustom(Displayer.displayNetworkStatus, Constants.NETWORK_STATUS_CHECK * 1000);

    if (!this.isRunning()) {
        await this.deck.shuffle();
    }

    Displayer.updatePlayerScore(this.player.score);
    Displayer.updateDeckRemainingCards(this.deck.remaining);

    /* Display player cards when the game is resumed */
    for (const card of this.player) {
        Displayer.displayPlayerCard(card);
    }

    getById("#action-deck").click(() => this.start());
    getById("#action-stop").click(() => this.stop());
    getById("#action-quit").click(() => this.stop());
    getById("#action-restart").click(() => this.restart());
    getById("#action-replay").click(() => this.restart());
    getById("#action-stand").click(() => this.stand());
    getById("#action-hit").click(() => this.draw());
    get(".endgame").click(() => get(".bj-final-modal").addClass("active").show());
    get(".bj-final-modal").click(({ target: { classList } }) => {
        // Destructuring event.target.classList
        if (classList.contains("bj-final-modal") || classList.contains("modal-close")) {
            get(".bj-final-modal").removeClass("active").hide();
            get(".endgame").show();
        }
    });

    if (this.isRunning()) {
        this.status = Constants.GAME_STATUS_READY;
        this.start();
    }
};

Game.prototype.isRunning = function () {
    return this.status === Constants.GAME_STATUS_RUNNING;
};

Game.prototype.start = async function () {
    if (this.status !== Constants.GAME_STATUS_READY) {
        return;
    }

    console.log("start");
    this.status = Constants.GAME_STATUS_RUNNING;

    getById("#action-deck").click(() => this.draw());
    getById("#action-stand").attr("disabled", true);
    getById("#action-stop").visible();
    get(".bj-scoreboard").visible();
    get(".bj-actions").visible();
    get(".deck-container").removeClass("initial-center");
    get(".bj-final-modal").removeClass("active").hide();
};

Game.prototype.stop = async function () {
    if (this.status === Constants.GAME_STATUS_READY) {
        return;
    }
    console.log("stop");

    this.status = Constants.GAME_STATUS_READY;

    getById("#action-deck").click(() => this.start());
    getById("#player-hand").html("");
    getById("#action-stop").hidden();
    getById("#action-restart").hidden();
    get(".bj-scoreboard").hidden();
    get(".bj-actions").hidden();
    get(".deck-container").addClass("initial-center");
    get(".bj-final-modal").removeClass("active").hide();
    get(".endgame").hide();

    if (this.player.score !== 0 || this.deck.remaining !== 52) {
        await this.deck.reshuffle();
    }

    this.player.score = 0;
    this.player.hand = [];
    Displayer.updatePlayerScore(this.player.score);
    Displayer.updateDeckRemainingCards(this.deck.remaining);
};

Game.prototype.restart = function () {
    if (
        (!this.isRunning() && this.status !== Constants.GAME_STATUS_FINISHED) ||
        this.player.isHandEmpty()
    ) {
        return;
    }
    console.log("restart");
    this.stop();
    this.start();
};

Game.prototype.stand = async function () {
    if (!this.isRunning() || this.player.isHandEmpty()) {
        return;
    }

    console.log("stand");

    this.status = Constants.GAME_STATUS_FINISHED;

    Displayer.displayStandScene();

    const nextCard = await this.deck.draw();
    nextCard.value = Card.getValue(nextCard);
    nextCard.currentScore = this.player.score;

    const hasWon = hasWonAfterStand(this.player, nextCard);
    Displayer.displayEndgame(hasWon, nextCard);
};

Game.prototype.draw = async function () {
    if (!this.isRunning()) {
        return;
    }
    console.log("draw");

    const card = await this.deck.draw();
    Displayer.displayDrawScene();
    this.player.draw(card);

    Displayer.displayPlayerCard(card);
    Displayer.updateDeckRemainingCards(this.deck.remaining);
    Displayer.updatePlayerScore(this.player.score);

    const hasWon = hasWonAfterDraw(this.player);
    if (hasWon === null) {
        return;
    }

    this.status = Constants.GAME_STATUS_FINISHED;
    Displayer.displayEndgame(hasWon);
};

Game.prototype.cancelDraw = function () {
    if (!this.isRunning()) {
        return false;
    }
    console.log("cancel draw");
};

Game.prototype.clear = function () {
    clearAllInterval();
    clearSelectorEvents();
};

const intervalStorage = [];

const setIntervalCustom = (handler, timeout) => {
    intervalStorage.push(setInterval(handler, timeout));
    handler();
};

const clearAllInterval = () => {
    for (const interval of intervalStorage) {
        clearInterval(interval);
    }
};

const hasWonAfterDraw = ({ score }) => (score === 21 || score > 21 ? score === 21 : null);

const hasWonAfterStand = ({ score }, { value }) => score + value > 21;

export default Game;
