import { getStateSelector } from "./settings";

/**
 * @param key
 * @param defaultValue
 * @returns {function(*)}
 */
export function getState(key, defaultValue = undefined) {
    return state => {
        if (typeof getStateSelector(state)[key] !== "undefined") {
            return getStateSelector(state)[key];
        }

        return defaultValue;
    };
}
