import { createSelector } from "reselect";
import { $getState } from "./settings";

export const $isDebugEnabled = createSelector(
    $getState,
    state => state.debug
);

export const $getCatalogs = createSelector(
    $getState,
    state => state.catalogs
);

export const $getCurrentLocale = createSelector(
    $getState,
    state => state.currentLocale
);

export const $getLastKnownError = createSelector(
    $getState,
    state => state.lastKnownError
);

export const $getIsLoading = createSelector(
    $getState,
    (_, { locale }) => locale,
    (state, locale) => state.isLoading[locale] || false
);

export const $getCurrentCatalog = createSelector(
    $getCatalogs,
    $getCurrentLocale,
    (catalogs, currentLocale) => catalogs[currentLocale]
);
