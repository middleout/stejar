import { createSelector } from "reselect";
import typeToReducer from "type-to-reducer";
import keyMirror from "keymirror";
import { prefixValues } from "@stejar/prefix-values";
import { getStateSelector, setMountPoint } from "@stejar/redux-settings";

/**
 * Define the module name
 */
const moduleName = "@stejar/config";

/**
 * The action types of the module - prefixed (and keymirrored)
 */
let ActionTypes = {
    LOADING: null,
    LOADED: null,
    FAILED_TO_LOAD: null,
};
ActionTypes = prefixValues(moduleName, keyMirror(ActionTypes));

/**
 * The default state of the module
 */
const defaultState = {
    isLoading: true,
    data: null,
    lastKnownError: null,
};

/**
 * Module Reducers
 */
const loadingConfig = state => ({ ...state, isLoading: true });
const loadedConfig = (state, action) => ({
    ...state,
    isLoading: false,
    data: action.payload,
    lastKnownError: null,
});
const failedToLoadConfig = (state, action) => ({
    ...state,
    isLoading: false,
    lastKnownError: action.payload,
});

/**
 * Module Selectors
 */
export const Selectors = {
    isLoading: createSelector(getStateSelector(moduleName), state => state.isLoading),
    getConfig: createSelector(getStateSelector(moduleName), state => state.data),
    getError: createSelector(getStateSelector(moduleName), state => state.lastKnownError),
};

/**
 * Module Actions
 */
export const Actions = {
    loadingConfig: () => ({ type: ActionTypes.LOADING }),
    loadedConfig: payload => ({ type: ActionTypes.LOADED, payload }),
    failedToLoadConfig: error => ({ type: ActionTypes.FAILED_TO_LOAD, payload: error }),
};

/**
 * Boot the module and return the reducer
 */
export const createReducer = (stateSelector, userModuleName = moduleName) => {
    setMountPoint(userModuleName, stateSelector);
    return typeToReducer(
        {
            [ActionTypes.LOADING]: loadingConfig,
            [ActionTypes.LOADED]: loadedConfig,
            [ActionTypes.FAILED_TO_LOAD]: failedToLoadConfig,
        },
        defaultState
    );
};
