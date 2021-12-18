import * as Helper from '../helpers.js';
import Constants from '../../constants.js';
import { get, getById, getAll } from '../Selector/selector.js';

const Game = function (context) {
    this.app = context;
    this.deck = null;
    this.status = Constants.GAME_STATUS_READY;
    setKeyboardEventsHandler(this);
};

Game.prototype.init = function () {
    getAll('.btn-action').click(function () {
        console.log(this.textContent);
    });
};

Game.prototype.start = function () {
    this.status = Constants.GAME_STATUS_RUNNING;
    this.attachKeyboard();
};

Game.prototype.stop = function () {
    this.status = Constants.GAME_STATUS_STOPPED;
    this.detachKeyboard();
};

Game.prototype.end = function () {
    this.status = Constants.GAME_STATUS_FINISHED;
    this.detachKeyboard();
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

Game.prototype.updateFigures = function () {

};

Game.prototype.displayInstructions = function () {

};

Game.prototype.displayInfo = function () {

};

Game.prototype.displayResult = function () {

};

Game.prototype.attachKeyboard = function () {
    document.addEventListener('keydown', this.keyboardEventsHandler);
};

Game.prototype.detachKeyboard = function () {
    document.removeEventListener('keydown', this.keyboardEventsHandler);
};

const setKeyboardEventsHandler = context => {
    Game.prototype.keyboardEventsHandler = function (event) {
        switch (event.code) {
            case "KeyD":
                context.draw();
                break;
            case "KeyC":
                context.cancelDraw();
                break;
        }
    };
};

export default Game;