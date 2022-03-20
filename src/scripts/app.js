import Constants from "./constants.js";
import Game from "./libs/Game/game.js";
import { get } from "./libs/Selector/selector.js";

let keyboardHandler, pageUnloadHandler;

const App = function () {
    this.game = null;
    this.autoSaveBeforeExit = true;
    this.init();
};

App.prototype.run = function () {
    this.game.init();
};

App.prototype.init = function () {
    this.setKeyboardHandler();
    this.setPageUnloadHandler();

    this.game = gameDidRunBefore() ? Game.create(getSavedState()) : new Game();
};

App.prototype.exit = function () {
    window.removeEventListener("beforeunload", pageUnloadHandler);
    document.removeEventListener("keydown", keyboardHandler);
    this.game.clear();
};

App.prototype.setKeyboardHandler = function () {
    keyboardHandler = (e) => {
        if (this.game.status === Constants.GAME_STATUS_RUNNING) {
            switch (e.code) {
                case "Backspace":
                    this.game.stop();
                    break;
                case "KeyS":
                    this.game.stand();
                    break;
                case "KeyD":
                    this.game.draw();
                    break;
                case "KeyC":
                    this.game.cancelDraw();
                    break;
                case "KeyR":
                    this.game.restart();
                    break;
            }
        } else if (this.game.status === Constants.GAME_STATUS_FINISHED) {
            switch (e.code) {
                case "KeyR":
                case "Space":
                    this.game.restart();
                    break;
                case "Backspace":
                    this.game.stop();
                    break;
                case "Escape":
                    get(".bj-final-modal").removeClass("active").hide();
                    get(".endgame").show();
                    break;
            }
        } else if (this.game.status === Constants.GAME_STATUS_READY && e.code === "Space") {
            this.game.start();
        }
    };

    document.addEventListener("keydown", keyboardHandler);
};

App.prototype.setPageUnloadHandler = function () {
    pageUnloadHandler = (e) => {
        e.preventDefault();
        clearStorage();
        if (this.autoSaveBeforeExit && this.game && !this.game.player.isHandEmpty()) {
            saveCurrentState(this.game);
        }
        this.exit();
    };

    window.addEventListener("beforeunload", pageUnloadHandler);
};

const saveCurrentState = (data) =>
    localStorage.setItem(Constants.LOCAL_STORAGE_KEY, JSON.stringify(data));

const getSavedState = () => JSON.parse(localStorage.getItem(Constants.LOCAL_STORAGE_KEY));

const clearStorage = () => localStorage.clear();

const gameDidRunBefore = () => (localStorage.getItem(Constants.LOCAL_STORAGE_KEY) ? true : false);

export default App;
