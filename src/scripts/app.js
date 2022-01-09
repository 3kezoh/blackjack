import Constants from "./constants.js";
import Game from "./libs/Game/game.js";

let keyboardHandler, pageUnloadHandler;

const App = function () {
    this.game = null;
    this.autoSaveBeforeExit = false;
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
        switch (e.code) {
            case "Space":
                this.game.start();
                break;
            case "Escape":
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
    };

    document.addEventListener("keydown", keyboardHandler);
};

App.prototype.setPageUnloadHandler = function () {
    pageUnloadHandler = (e) => {
        e.preventDefault();
        clearStorage();
        this.autoSaveBeforeExit && this.game && saveCurrentState(this.game);
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
