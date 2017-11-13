import { getStateSelector } from "./settings";

/**
 * @param state
 * @param locale
 * @returns {boolean}
 */
export function hasLocale(state, locale) {
    return getCatalogs(state)[locale] !== undefined && Object.keys(getCatalogs(state)[locale]) > 0;
}

/**
 * @param state
 * @returns {*}
 */
export function getCurrentLocale(state) {
    return getStateSelector(state).currentLocale;
}

/**
 * @param state
 * @returns {*}
 */
export function getCatalogs(state) {
    return getStateSelector(state).catalogs;
}

/**
 * @param state
 * @returns {*}
 */
export function getCurrentLocaleCatalog(state) {
    return getCatalogs(state)[getCurrentLocale(state)];
}
