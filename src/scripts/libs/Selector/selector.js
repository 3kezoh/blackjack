import EventManager from "./event.js";

const SELECTOR_ID = 1;
const SELECTOR_FREE = 2;
const SELECTOR_MULTIPLE_FREE = 3;

const EventHandler = new EventManager();

const Selector = function (selector, selectorType) {
    this.selector = selector;
    this.elements = [];
    this.init(selectorType);
};

Selector.prototype.init = function (selectorType) {
    let elements;
    switch (selectorType) {
        case SELECTOR_ID:
            elements = document.getElementById(this.selector.replace(/^#/, ""));
            elements && this.elements.push(elements);
            break;
        case SELECTOR_FREE:
            elements = document.querySelector(this.selector);
            elements && this.elements.push(elements);
            break;
        case SELECTOR_MULTIPLE_FREE:
            elements = document.querySelectorAll(this.selector);
            elements && (this.elements = Array.from(elements));
            break;
        default:
            return;
    }

    if (!this.elements.length) {
        console.error(`'${this.selector}' doesn't match any element in the DOM tree`);
    }
};

Selector.prototype.get = function () {
    return this.elements.length > 1 ? this.elements : this.elements[0];
};

Selector.prototype.on = function (event, callback) {
    this.elements.forEach((el) => {
        EventHandler.bind(el, event, callback);
    });

    return this;
};

Selector.prototype.off = function (event) {
    this.elements.forEach((el) => {
        EventHandler.unbind(el, event ?? null);
    });

    return this;
};

Selector.prototype.click = function (callback) {
    return this.on("click", callback);
};

Selector.prototype.change = function (callback) {
    return this.on("change", callback);
};

Selector.prototype.append = function (html) {
    if (html === undefined) return null;

    this.elements.forEach((el) => {
        el.innerHTML = el.innerHTML + html;
    });

    return this;
};

Selector.prototype.prepend = function (html) {
    if (html === undefined) return null;

    this.elements.forEach((el) => {
        el.innerHTML = html + el.innerHTML;
    });

    return this;
};

Selector.prototype.html = function (html) {
    if (html === undefined) return this.elements[0].innerHTML;

    this.elements.forEach((el) => {
        el.innerHTML = html;
    });

    return this;
};

Selector.prototype.val = function (value) {
    if (value === undefined) return this.elements[0].value;

    this.elements.forEach((el) => {
        el.value = value;
    });

    return this;
};

Selector.prototype.text = function (text) {
    if (text === undefined) return this.elements.map((el) => el.textContent).join(" ");

    this.elements.forEach((el) => {
        el.textContent = text;
    });

    return this;
};

Selector.prototype.addClass = function (...classNames) {
    this.elements.forEach((el) => {
        el.classList.add(...classNames);
    });

    return this;
};

Selector.prototype.removeClass = function (...classNames) {
    this.elements.forEach((el) => {
        el.classList.remove(...classNames);
    });

    return this;
};

Selector.prototype.hasClass = function (className) {
    return this.elements.some((el) => el.classList.contains(className));
};

Selector.prototype.attr = function (name, value) {
    if (!name) return null;
    if (value === undefined) return this.elements[0].getAttribute(name);

    this.elements.forEach((el) => {
        el.setAttribute(name, value);
    });

    return this;
};

Selector.prototype.removeAttr = function (name) {
    this.elements.forEach((el) => {
        el.removeAttribute(name);
    });

    return this;
};

Selector.prototype.hide = function () {
    this.elements.forEach((el) => {
        el.style.display = "none";
    });

    return this;
};

Selector.prototype.show = function () {
    this.elements.forEach((el) => {
        el.style.removeProperty("display");
        if (getComputedStyle(el).display === "none") {
            el.style.display = "block";
        }
    });

    return this;
};

Selector.prototype.css = function (property, value) {
    if (!property) return null;
    if (value === undefined) return this.elements[0].style[property];

    this.elements.forEach((el) => {
        el.style[property] = value;
    });

    return this;
};

Selector.prototype.hidden = function () {
    return this.addClass("hidden");
};

Selector.prototype.visible = function () {
    return this.removeClass("hidden");
};

Selector.prototype[Symbol.iterator] = function* () {
    for (const el of this.elements) {
        yield el;
    }
};

export const getById = (id) => (id ? new Selector(id, SELECTOR_ID) : null);
export const get = (selector) => (selector ? new Selector(selector, SELECTOR_FREE) : null);
export const getAll = (selector) =>
    selector ? new Selector(selector, SELECTOR_MULTIPLE_FREE) : null;
export const clearSelectorEvents = () => EventHandler.cleanup();

/*
============ Working inheritance but no IDE autocompletion ============

const SelectorById = function (selector) {
    Selector.call(this, selector.replace(/^#/, ''));
};
SelectorById.prototype = Object.create(Selector.prototype);
SelectorById.prototype.init = function () {
    this.elements.push(document.getElementById(this.selector));
}

const SelectorFree = function (selector) {
    Selector.call(this, selector);
};
SelectorFree.prototype = Object.create(Selector.prototype);
SelectorFree.prototype.init = function () {
    this.elements.push(document.querySelector(this.selector));
}

const SelectorMultipleFree = function (selector) {
    Selector.call(this, selector);
};
SelectorMultipleFree.prototype = Object.create(Selector.prototype);
SelectorMultipleFree.prototype.init = function () {
    this.elements = document.querySelectorAll(this.selector);
}

export const get = selector => selector ? new SelectorFree(selector) : null;
export const getById = id => id ? new SelectorById(id) : null;
export const getAll = selector => selector ? new SelectorMultipleFree(selector) : null;

*/
