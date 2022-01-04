import Constants from '../../constants.js';
import Player from '../../../libs/Player/index.js';
import Deck from '../../../libs/Deck/index.js';
import Displayer from '../Displayer/displayer.js';
import { get, getById, getAll, clearSelectorEvents } from '../Selector/selector.js';

const Game = function () {
    this.deck = new Deck();
    this.player = new Player();
    this.status = Constants.GAME_STATUS_READY;
};

Game.create = data => {
    const instance = new Game();

    instance.deck = Deck.create(data.deck);
    instance.player = Player.create(data.player);
    instance.status = data.status;

    return instance;
};

Game.prototype.init = function () {
    setIntervalCustom(Displayer.displayNetworkStatus, Constants.NETWORK_STATUS_CHECK * 1000);
    Displayer.displayNetworkStatus();
    Displayer.updateDeckRemainingCards(this.deck.remaining);
    Displayer.updatePlayerScore(this.player.score);

    /* Display player cards when the game is resumed */
    for (card of this.player) {
        Displayer.displayPlayerCard(card);
    }

    /* Event listeners */
    const self = this;
    getAll('.btn-action').click(function () {
        console.log(this.textContent);
    });
};

Game.prototype.start = function () {
    this.status = Constants.GAME_STATUS_RUNNING;
};

Game.prototype.stop = function () {
    this.status = Constants.GAME_STATUS_STOPPED;
};

Game.prototype.end = function () {
    this.status = Constants.GAME_STATUS_FINISHED;
};

Game.prototype.reset = function () {
    this.status = Constants.GAME_STATUS_READY;
};

Game.prototype.restart = function () {
    this.stop();
    this.start();
};

Game.prototype.isRunning = function () {
    return this.status === Constants.GAME_STATUS_RUNNING;
};

Game.prototype.draw = function () {
    console.log('draw');
};

Game.prototype.cancelDraw = function () {
    console.log('cancel draw');
};

Game.prototype.clear = function () {
    clearAllInterval();
    clearSelectorEvents();
};

const intervalStorage = [];

const setIntervalCustom = (handler, timeout) => {
    intervalStorage.push(setInterval(handler, timeout));
};

const clearAllInterval = () => {
    for (const interval of intervalStorage) {
        clearInterval(interval);
    }
}

export default Game;