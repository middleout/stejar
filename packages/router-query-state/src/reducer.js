import { getDefaultState } from "./settings";

/**
 * @param state
 * @param action
 * @returns {{}}
 */
export function queryStateReducer(state = getDefaultState(), action) {
    switch (action.type) {
        default:
            return state;
    }
}
