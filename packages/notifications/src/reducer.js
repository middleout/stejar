import { CLEARED_NOTIFICATION_ACTION, ADDED_NOTIFICATION_ACTION, DISMISSED_NOTIFICATION_ACTION } from "./actionTypes";

const defaultState = [];

export function notificationsReducer(state = defaultState, action) {
    switch (action.type) {
        case ADDED_NOTIFICATION_ACTION:
            return [action.payload, ...state.filter(({ id }) => id !== action.payload.id)];
        case DISMISSED_NOTIFICATION_ACTION:
            return state.filter(notif => notif.id !== action.payload);
        case CLEARED_NOTIFICATION_ACTION:
            return [];
        default:
            return state;
    }
}
