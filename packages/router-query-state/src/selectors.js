import { getStateSelector } from "./settings";

/**
 * @param state
 * @returns {string}
 */
export function getQueryParam(state) {
    return getStateSelector(state).queryParam;
}
