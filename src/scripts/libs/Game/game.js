import Deck from "../Deck/index.js";
import Player from "../Player/index.js";
import Constants from "../../constants.js";
import Displayer from "../Displayer/displayer.js";
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
    await this.deck.shuffle();

    setIntervalCustom(Displayer.displayNetworkStatus, Constants.NETWORK_STATUS_CHECK * 1000);

    Displayer.displayNetworkStatus();
    Displayer.updateDeckRemainingCards(this.deck.remaining);
    Displayer.updatePlayerScore(this.player.score);

    /* Display player cards when the game is resumed */
    for (card of this.player) {
        Displayer.displayPlayerCard(card);
    }

    /* Event listeners */
    getById("#action-deck").click(() => this.start());
    getById("#action-stop").click(() => this.stop());
    getById("#action-restart").click(() => this.restart());
    getById("#action-stand").click(() => this.stand());
    getById("#action-hit").click(() => this.draw());
};

Game.prototype.isRunning = function () {
    return this.status === Constants.GAME_STATUS_RUNNING;
};

Game.prototype.start = async function () {
    if (this.status !== Constants.GAME_STATUS_READY) {
        return false;
    }

    console.log("start");

    this.status = Constants.GAME_STATUS_RUNNING;

    getById("#action-deck").click(() => this.draw());
    getById("#action-stand").attr("disabled", true);
    getById("#action-stop").removeClass("hidden");
    get(".deck-container").removeClass("initial-center");
    get(".bj-scoreboard").removeClass("hidden");
    get(".bj-actions").removeClass("hidden");
};

Game.prototype.stop = function () {
    if (this.status === Constants.GAME_STATUS_READY) {
        return false;
    }
    console.log("stop");
    this.status = Constants.GAME_STATUS_READY;
    getById("#player-hand").html("");
    getById("#action-deck").click(() => this.start());
    getById("#action-stop").addClass("hidden");
    getById("#action-restart").addClass("hidden");
    get(".deck-container").addClass("initial-center");
    get(".bj-scoreboard").addClass("hidden");
    get(".bj-actions").addClass("hidden");
};

Game.prototype.restart = function () {
    if (!this.isRunning() || this.player.isHandEmpty()) {
        return false;
    }
    console.log("restart");
    this.stop();
    this.start();
};

Game.prototype.stand = async function () {
    if (!this.isRunning() || this.player.isHandEmpty()) {
        return false;
    }

    console.log("stand");

    this.status = Constants.GAME_STATUS_FINISHED;

    Displayer.displayStandScene();

    if (this.player.score < 21) {
        await this.draw();

        if (this.player.score > 21) {
            console.log("win");
        } else {
            console.log("loose");
        }

        return this.stop();
    }
};

Game.prototype.draw = async function () {
    console.log("draw");

    Displayer.displayDrawScene();

    const card = await this.deck.draw();

    console.log("card", card);

    this.player.draw(card);

    Displayer.displayPlayerCard(card);
    Displayer.updateDeckRemainingCards(this.deck.remaining);
    Displayer.updatePlayerScore(this.player.score);

    if (this.isRunning()) {
        await this.check();
    }
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

Game.prototype.check = async function () {
    console.log("check");

    if (this.player.score === 21) {
        console.log("win");
        return this.stop();
    }

    if (this.player.score > 21) {
        console.log("loose");
        return this.stop();
    }
};

const intervalStorage = [];

const setIntervalCustom = (handler, timeout) => {
    intervalStorage.push(setInterval(handler, timeout));
};

const clearAllInterval = () => {
    for (const interval of intervalStorage) {
        clearInterval(interval);
    }
};

export default Game;
