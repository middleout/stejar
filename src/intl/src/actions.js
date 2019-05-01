import { ACTION_TYPES } from "./actionTypes";
import { $getCatalogs } from "./selectors";

export const loadingCatalog = locale => ({ type: ACTION_TYPES.LOADING_CATALOG_ACTION, payload: { locale } });

export const loadedCatalog = (locale, catalog) => ({
    type: ACTION_TYPES.LOADED_CATALOG_ACTION,
    payload: { locale, catalog },
});

export const failedToLoadCatalog = (locale, error) => ({
    type: ACTION_TYPES.FAILED_TO_LOAD_ACTION,
    payload: { locale, error },
});

export const changeLocale = locale => (dispatch, getState) => {
    // Check via getState if the locale is already set
    const catalogs = $getCatalogs(getState());
    if (!Object.keys(catalogs).includes(locale)) {
        throw new Error(`Locale ${locale} has not been loaded yet.`);
    }

    dispatch({ type: ACTION_TYPES.CHANGED_LOCALE_ACTION, payload: { locale } });
};

export const enableDebug = () => ({ type: ACTION_TYPES.ENABLED_DEBUG_ACTION });
export const disableDebug = () => ({ type: ACTION_TYPES.DISABLED_DEBUG_ACTION });
