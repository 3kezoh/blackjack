import Deck from "../Deck/index.js";
import Player from "../Player/index.js";
import Constants from "../../constants.js";
import Displayer from "../Displayer/displayer.js";
import Card from "../Card/index.js";
import { clearSelectorEvents, get, getAll, getById } from "../Selector/selector.js";
import Aborter from "../Aborter/aborter.js";

const Game = function () {
    this.deck = new Deck();
    this.player = new Player();
    this.status = Constants.GAME_STATUS_READY;
    this.locker = false;
};

Game.create = ({ deck, locker, player, status }) => {
    const instance = new Game();

    instance.deck = Deck.create(deck);
    instance.player = Player.create(player);
    instance.status = status;
    instance.locker = locker;

    return instance;
};

Game.prototype.init = async function () {
    this.lock();

    setInterval(Displayer.displayNetworkStatus, Constants.NETWORK_STATUS_CHECK * 1000);

    Displayer.displayDeck(52);
    Displayer.displayNetworkStatus();
    Displayer.updateDeckRemainingCards(this.deck.remaining);
    Displayer.updatePlayerScore(this.player.score);

    getById("deck").click(() => this.start());
    getById("game-title").click(() => this.start());
    getById("action-stop").click(() => this.stop());
    getById("action-quit").click(() => this.stop());
    getById("action-restart").click(() => this.restart());
    getById("action-replay").click(() => this.restart());
    getById("action-stand").click(() => this.stand());
    getById("action-hit").click(() => this.hit());
    get(".endgame").click(() => get(".bj-final-modal").addClass("active").show());
    get(".bj-final-modal").click((e) => {
        if (
            e.target.classList.contains("bj-final-modal") ||
            e.target.classList.contains("modal-close")
        ) {
            get(".bj-final-modal").removeClass("active").hide();
            get(".endgame").show();
        }
    });

    if (this.status !== Constants.GAME_STATUS_READY) {
        this.resume();
    }

    this.unlock();
};

Game.prototype.start = async function () {
    if (this.status !== Constants.GAME_STATUS_READY) {
        return;
    }

    this.lock();

    try {
        if (!isOnline()) {
            throw new Error("Please check your network status");
        }

        if (!this.deck.isAlreadySet()) {
            await this.deck.shuffle();
        } else if (
            this.deck.isAlreadySet() &&
            (this.player.score !== 0 || this.deck.remaining !== 52)
        ) {
            await this.deck.reshuffle();
        }
        Displayer.updatePlayerScore(this.player.score);
        Displayer.updateDeckRemainingCards(this.deck.remaining);

        Displayer.handleStartEvent();
        await Displayer.shuffleDeck();

        getById("deck").click(() => this.hit());

        this.status = Constants.GAME_STATUS_RUNNING;
    } catch (error) {
        Displayer.displayErrorMessage(error.message);
    } finally {
        this.unlock();
    }
};

Game.prototype.stop = function () {
    if (this.status === Constants.GAME_STATUS_READY) {
        return;
    }
    getById("deck").click(() => this.start());

    Displayer.handleStopEvent();

    this.status = Constants.GAME_STATUS_READY;

    this.player.score = 0;
    this.player.hand = [];
};

Game.prototype.restart = function () {
    if (
        (!this.isRunning() && this.status !== Constants.GAME_STATUS_FINISHED) ||
        this.player.isHandEmpty()
    ) {
        return;
    }

    this.stop();
    this.start();
};

Game.prototype.stand = async function () {
    if (this.isLocked() || !this.isRunning() || this.player.isHandEmpty()) {
        return;
    }
    this.lock();

    try {
        if (!isOnline()) {
            throw new Error("Please check your network status");
        }

        const nextCard = await this.deck.pop();
        nextCard.value = Card.getValue(nextCard);
        nextCard.currentScore = this.player.score;

        const hasWon = hasWonAfterStand(this.player, nextCard);
        Displayer.displayEndgame(hasWon, nextCard);
        Displayer.handleStandEvent();
        this.status = Constants.GAME_STATUS_FINISHED;
    } catch (error) {
        Displayer.displayErrorMessage(error.message);
    } finally {
        this.unlock();
    }
};

Game.prototype.hit = async function () {
    if (this.isLocked() || !this.isRunning() || this.deck.isEmpty()) {
        return;
    }
    this.lock();

    try {
        if (!isOnline()) {
            throw new Error("Please check your network status");
        }

        Displayer.handleDrawStart();

        const card = await this.deck.draw();

        this.player.draw(card);

        await Displayer.drawCard(card);
        Displayer.updateDeckRemainingCards(this.deck.remaining);
        Displayer.updatePlayerScore(this.player.score);

        const hasWon = hasWonAfterDraw(this.player);

        if (hasWon !== null) {
            this.status = Constants.GAME_STATUS_FINISHED;
            Displayer.displayEndgame(hasWon);
        }
    } catch (error) {
        Displayer.displayErrorMessage(error.message);
    } finally {
        Displayer.handleDrawEnd();

        if (this.deck.isEmpty()) {
            getById("#action-hit").attr("disabled", true);
        }

        this.unlock();
    }
};

Game.prototype.cancelDraw = function () {
    if (!this.isLocked() || !this.isRunning()) {
        return;
    }

    Aborter.abort(Constants.ABORT_KEY_DRAW);
};

Game.prototype.resume = function () {
    get(".bj-scoreboard").visible();
    getById("#action-restart").visible();
    getById("#action-stop").visible();
    get(".bj-final-modal").removeClass("active").hide();
    getById("game-title").hide();

    get("#hand").html("").show();
    for (const card of this.player) {
        Displayer.displayPlayerCard(card);
    }

    if (this.status === Constants.GAME_STATUS_RUNNING) {
        getById("deck").click(() => this.hit());
        getById("#action-hit").removeAttr("disabled");
        getById("#action-stand").removeAttr("disabled");
        get(".bj-actions").visible();
    } else if (this.status === Constants.GAME_STATUS_FINISHED) {
        get(".endgame").show();
        get(".bj-actions").hidden();

        if (this.deck.poppedCard) {
            this.deck.poppedCard.value = Card.getValue(this.deck.poppedCard);
            this.deck.poppedCard.currentScore = this.player.score;

            Displayer.displayEndgame(
                hasWonAfterStand(this.player, this.deck.poppedCard),
                this.deck.poppedCard
            );
        } else {
            Displayer.displayEndgame(hasWonAfterDraw(this.player));
        }
    }
};

Game.prototype.clear = function () {
    clearSelectorEvents();
};

Game.prototype.isRunning = function () {
    return this.status === Constants.GAME_STATUS_RUNNING;
};

Game.prototype.isLocked = function () {
    return this.locker;
};

Game.prototype.lock = function () {
    this.locker = true;
};

Game.prototype.unlock = function () {
    this.locker = false;
};

const hasWonAfterDraw = ({ score }) => (score >= 21 ? score === 21 : null);

const hasWonAfterStand = ({ score }, { value }) => score + value > 21;

const isOnline = () => window.navigator.onLine;

export default Game;
