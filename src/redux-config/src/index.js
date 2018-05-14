import { createSelector } from "reselect";
import typeToReducer from "type-to-reducer";
import keyMirror from "keymirror";
import { prefixValues } from "@stejar/prefix-values";
import { getState, setMountPoint } from "@stejar/redux-settings";

/**
 * Define the module name
 */
const moduleName = "@stejar/config";

/**
 * The action types of the module - prefixed (and keymirrored)
 */
let ActionTypes = {
    LOADING_CONFIG: null,
    LOADED_CONFIG: null,
    FAILED_TO_LOAD_CONFIG: null,
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
const reducer = typeToReducer(
    {
        [ActionTypes.LOADING_CONFIG]: loadingConfig,
        [ActionTypes.LOADED_CONFIG]: loadedConfig,
        [ActionTypes.FAILED_TO_LOAD_CONFIG]: failedToLoadConfig,
    },
    defaultState
);

/**
 * Small helper to facilitate booting of the module
 */
const throwBootError = type => {
    throw new Error(`Cannot use ${type} without booting the module first`);
};

/**
 * Module Selectors
 */
export const Selectors = {
    isLoading: () => throwBootError("selectors"),
    getConfig: () => throwBootError("selectors"),
    getError: () => throwBootError("selectors"),
};

/**
 * Module Actions
 */
export const Actions = {
    loadingConfig: () => throwBootError("actions"),
    loadedConfig: () => throwBootError("actions"),
    failedToLoadConfig: () => throwBootError("actions"),
};

/**
 * Boot the module and return the reducer
 */
export const createReducer = (stateSelector, userModuleName = moduleName) => {
    setMountPoint(userModuleName, stateSelector);
    Actions.loadingConfig = () => ({ type: ActionTypes.LOADING_CONFIG });
    Actions.loadedConfig = payload => ({ type: ActionTypes.LOADED_CONFIG, payload });
    Actions.failedToLoadConfig = error => ({ type: ActionTypes.FAILED_TO_LOAD_CONFIG, payload: error });
    Selectors.isLoading = createSelector(getState(moduleName), state => state.isLoading);
    Selectors.getConfig = createSelector(getState(moduleName), state => state.data);
    Selectors.getError = createSelector(getState(moduleName), state => state.lastKnownError);

    return reducer;
};
