const EventManager = function () {
    this.events = [];
};

EventManager.prototype.unbind = function (element, eventType) {
    this.events = this.events.filter((el) => {
        if (
            (eventType && el.type === eventType && el.element === element) ||
            (!eventType && el.element === element)
        ) {
            element.removeEventListener(el.type, el.callback);
            return false;
        }
        return true;
    });
};

EventManager.prototype.bind = function (element, eventType, callback) {
    this.unbind(element, eventType);
    this.events.push({
        type: eventType,
        callback: callback,
        element: element,
    });
    element.addEventListener(eventType, callback);
};

EventManager.prototype.cleanup = function () {
    this.events.forEach((el) => {
        el.element.removeEventListener(el.type, el.callback);
    });
    this.events = [];
};

export default EventManager;
