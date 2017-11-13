import { CHANGED_LOCALE_ACTION, LOADED_LOCALE_ACTION } from "./actionTypes";
import { createAction } from "@stejar/redux-module/createAction";

export const loadedLocale = (locale, catalog) =>
    createAction(LOADED_LOCALE_ACTION, {
        locale,
        catalog,
    });

export const changeLocale = locale => createAction(CHANGED_LOCALE_ACTION, locale);
