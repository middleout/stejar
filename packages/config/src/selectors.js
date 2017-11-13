import { getStateSelector } from "./settings";

/**
 * @param state
 * @returns {*}
 */
export function getConfig(state) {
    return getStateSelector(state);
}
