import { SET_STATE_ACTION } from "./actionTypes";
import { getDefaultState } from "./settings";

/**
 * @param state
 * @param action
 * @returns {{}}
 */
export function stateReducer(state = getDefaultState(), action) {
    switch (action.type) {
        case SET_STATE_ACTION:
            return {
                ...state,
                [action.payload.key]: { ...action.payload.state },
            };
        default:
            return state;
    }
}
