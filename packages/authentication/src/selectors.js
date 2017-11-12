import { getStateSelector } from "./settings";

/**
 * @param state
 * @returns {boolean}
 */
export function hasIdentity(state) {
    return Object.keys(getStateSelector(state)).length > 0;
}

/**
 * @param state
 * @returns {*}
 */
export function getIdentity(state) {
    return getStateSelector(state);
}
