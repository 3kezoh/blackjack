import Game from "./libs/Game/game.js";
import { clearEvents } from "./libs/Selector/selector.js";

const App = function () {
    this.game = new Game(this);
};

App.prototype.run = function () {
    this.init();
    this.game.init();
    this.game.start();
};

App.prototype.init = function () {

};

App.prototype.onClosedTab = function () {

};

App.prototype.saveState = function () {

};

App.prototype.resume = function () {

};

App.prototype.stop = function () {
    clearEvents();
};

export default App;