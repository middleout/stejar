import { createSelector } from "reselect";
import typeToReducer from "type-to-reducer";
import keyMirror from "keymirror";
import { prefixValues } from "@stejar/prefix-values";
import { getStateSelector, setMountPoint } from "@stejar/redux-settings";

/**
 * Define the module name
 */
const moduleName = "@stejar/intl";

/**
 * The action types of the module - prefixed (and keymirrored)
 */
let ActionTypes = {
    LOADING_CATALOG: null,
    LOADED_CATALOG: null,
    FAILED_TO_LOAD: null,
    CHANGED_LOCALE: null,
};
ActionTypes = prefixValues(moduleName, keyMirror(ActionTypes));

/**
 * The default state of the module
 */
const defaultState = {
    isLoading: {},
    catalogs: {},
    currentLocale: null,
    lastKnownError: null,
    debug: false,
};

/**
 * Module Reducers
 */
const loadingCatalog = (state, { payload }) => ({
    ...state,
    isLoading: { ...state.isLoading, [payload.locale]: true },
});
const loadedCatalog = (state, { payload }) => ({
    ...state,
    isLoading: { ...state.isLoading, [payload.locale]: false },
    catalogs: { ...state.catalogs, [payload.locale]: payload.catalog },
    lastKnownError: null,
});
const failedToLoadCatalog = (state, { payload }) => ({
    ...state,
    isLoading: { ...state.isLoading, [payload.locale]: false },
    lastKnownError: payload.error,
});
const changedLocale = (state, { payload }) => ({
    ...state,
    currentLocale: payload.locale,
});

/**
 * Module Selectors
 */
const isDebugEnabled = createSelector(getStateSelector(moduleName), state => state.debug);
const getCatalogs = createSelector(getStateSelector(moduleName), state => state.catalogs);
const getCurrentLocale = createSelector(getStateSelector(moduleName), state => state.currentLocale);
const getCurrentCatalog = createSelector(
    getCatalogs,
    getCurrentLocale,
    (catalogs, currentLocale) => catalogs[currentLocale]
);

export const Selectors = {
    isDebugEnabled,
    getCatalogs,
    getCurrentCatalog,
    getCurrentLocale,
};

/**
 * Module Actions
 */
export const Actions = {
    loadingCatalog: locale => ({ type: ActionTypes.LOADING_CATALOG, payload: { locale } }),
    loadedCatalog: (locale, catalog) => ({ type: ActionTypes.LOADED_CATALOG, payload: { locale, catalog } }),
    failedToLoadCatalog: (locale, error) => ({ type: ActionTypes.FAILED_TO_LOAD, payload: { locale, error } }),
    changeLocale: locale => (dispatch, getState) => {
        // Check via getState if the locale is already set
        const catalogs = Selectors.getCatalogs(getState());
        if (!Object.keys(catalogs).includes(locale)) {
            throw new Error(`Locale ${locale} has not been loaded yet.`);
        }

        dispatch({ type: ActionTypes.CHANGED_LOCALE, payload: { locale } });
    },
};

/**
 * Boot the module and return the reducer
 */
export const createReducer = (stateSelector, debug = false, userModuleName = moduleName) => {
    setMountPoint(userModuleName, stateSelector);

    return typeToReducer(
        {
            [ActionTypes.LOADING_CATALOG]: loadingCatalog,
            [ActionTypes.LOADED_CATALOG]: loadedCatalog,
            [ActionTypes.FAILED_TO_LOAD]: failedToLoadCatalog,
            [ActionTypes.CHANGED_LOCALE]: changedLocale,
        },
        { ...defaultState, debug }
    );
};
