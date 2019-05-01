import typeToReducer from "type-to-reducer";
import { ACTION_TYPES } from "./actionTypes";

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

const enabledDebug = state => ({
    ...state,
    debug: true,
});

const disabledDebug = state => ({
    ...state,
    debug: false,
});

const defaultState = {
    isLoading: {},
    catalogs: {},
    currentLocale: null,
    lastKnownError: null,
    debug: false,
};

export const reducer = typeToReducer(
    {
        [ACTION_TYPES.LOADING_CATALOG_ACTION]: loadingCatalog,
        [ACTION_TYPES.LOADED_CATALOG_ACTION]: loadedCatalog,
        [ACTION_TYPES.FAILED_TO_LOAD_ACTION]: failedToLoadCatalog,
        [ACTION_TYPES.CHANGED_LOCALE_ACTION]: changedLocale,
        [ACTION_TYPES.ENABLED_DEBUG_ACTION]: enabledDebug,
        [ACTION_TYPES.DISABLED_DEBUG_ACTION]: disabledDebug,
    },
    { ...defaultState }
);
