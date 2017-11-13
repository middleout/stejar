import { getDefaultState } from "./settings";
import {
    ANIMATE_IN_LOADER_ACTION,
    ANIMATE_OUT_LOADER_ACTION,
    DISPLAY_LOADER_ACTION,
    HIDE_LOADER_ACTION,
} from "./actionTypes";

export function loaderReducer(state = getDefaultState(), action) {
    switch (action.type) {
        case DISPLAY_LOADER_ACTION:
            return { ...state, [action.payload]: { ...state[action.payload], display: true } };
        case ANIMATE_IN_LOADER_ACTION:
            return { ...state, [action.payload]: { ...state[action.payload], animate: true } };
        case HIDE_LOADER_ACTION:
            return { ...state, [action.payload]: { ...state[action.payload], display: false } };
        case ANIMATE_OUT_LOADER_ACTION:
            return { ...state, [action.payload]: { ...state[action.payload], animate: false } };
        default:
            return state;
    }
}
