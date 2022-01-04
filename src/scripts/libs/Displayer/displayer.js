import Constants from "../../constants.js";
import { get, getById, getAll } from "../Selector/selector.js";

const Displayer = function () { };

Displayer.prototype.constructor = () => { };

Displayer.displayNetworkStatus = () => {
    const isOnline = window.navigator.onLine;
    console.log('online : ' + isOnline);
};

Displayer.displayDrawError = () => { };

Displayer.displayFinalResult = (hasWon) => { };

Displayer.displayPlayerCard = (card) => { };

Displayer.updatePlayerScore = (score) => { };

Displayer.updateDeckRemainingCards = (remaining) => { };

export default Displayer;