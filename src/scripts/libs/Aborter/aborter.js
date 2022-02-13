/**
 * @type {AbortController[]}
 */
const abortControllers = [];

/**
 * @class
 */
const Aborter = function () {};

/**
 * @param {string} key
 * @param {AbortController} controller
 */
Aborter.set = (key, controller = null) =>
    (abortControllers[key] = controller ?? new AbortController());

/**
 * @param {string} key
 * @returns {?AbortController}
 */
Aborter.get = (key) =>
    abortControllers[key] instanceof AbortController ? abortControllers[key] : null;

/**
 * @param {string} key
 * @returns {AbortSignal}
 */
Aborter.getSignal = (key) => Aborter.get(key)?.signal;

/**
 * @param {string} key
 */
Aborter.abort = (key) => Aborter.get(key)?.abort();

export default Aborter;
