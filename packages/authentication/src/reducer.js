import { AUTHENTICATED_ACTION, LOGOUT_ACTION } from "./actionTypes";

export function authReducer(state = {}, action) {
    switch (action.type) {
        case AUTHENTICATED_ACTION:
            return action.payload;
        case LOGOUT_ACTION:
            return {};
        default:
            return state;
    }
}
