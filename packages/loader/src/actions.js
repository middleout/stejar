import {
    ANIMATE_IN_LOADER_ACTION,
    ANIMATE_OUT_LOADER_ACTION,
    DISPLAY_LOADER_ACTION,
    HIDE_LOADER_ACTION,
} from "./actionTypes";
import { createAction } from "@stejar/redux-module/createAction";

export function showLoader(loaderName) {
    return dispatch => {
        dispatch(display(loaderName));
        setTimeout(() => dispatch(animateInLoader(loaderName)), 10);
    };
}

export const display = loaderName => createAction(DISPLAY_LOADER_ACTION, loaderName);
export const animateInLoader = loaderName => createAction(ANIMATE_IN_LOADER_ACTION, loaderName);
export const animateOutLoader = loaderName => createAction(ANIMATE_OUT_LOADER_ACTION, loaderName);
export const hideLoader = loaderName => createAction(HIDE_LOADER_ACTION, loaderName);
