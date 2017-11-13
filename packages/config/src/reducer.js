import { SET_CONFIG } from "./actionTypes";
import { getDefaultState } from "./settings";

export function configReducer(state = getDefaultState(), action) {
    switch (action.type) {
        case SET_CONFIG:
            return { ...action.payload };
        default:
            return state;
    }
}
