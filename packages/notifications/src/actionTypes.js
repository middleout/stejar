import { getActionsPrefix } from "./settings";

export const ADDED_NOTIFICATION_ACTION = getActionsPrefix() + "/ADDED";
export const DISMISSED_NOTIFICATION_ACTION = getActionsPrefix() + "/DISMISSED";
export const CLEARED_NOTIFICATION_ACTION = getActionsPrefix() + "/CLEARED";
