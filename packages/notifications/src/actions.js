import { ADDED_NOTIFICATION_ACTION, CLEARED_NOTIFICATION_ACTION, DISMISSED_NOTIFICATION_ACTION } from "./actionTypes";
import { createAction } from "@stejar/redux-module/createAction";

/**
 * Publish a notification,
 * - if `dismissAfter` was set, the notification will be auto dismissed after the given period.
 * - if id wasn't specified, a time based id will be generated.``
 */
export function addNotifcation(message, type, dismissAfter = undefined) {
    const payload = {
        message,
        type,
    };

    if (dismissAfter) {
        payload.dismissAfter = dismissAfter;
    }

    if (!payload.id) {
        payload.id = new Date().getTime();
    }
    return dispatch => {
        dispatch({ type: ADDED_NOTIFICATION_ACTION, payload });

        if (payload.dismissAfter) {
            setTimeout(() => {
                dispatch({
                    type: DISMISSED_NOTIFICATION_ACTION,
                    payload: payload.id,
                });
            }, payload.dismissAfter);
        }
    };
}

/**
 * Dismiss a notification by the given id.
 */
export const dismissNotification = id => createAction(DISMISSED_NOTIFICATION_ACTION, id);

/**
 * Clear all notifications
 */
export const clearNotifications = () => createAction(CLEARED_NOTIFICATION_ACTION);
