import { getStateSelector } from "./settings";

export function getNotifications(state) {
    return getStateSelector(state);
}
