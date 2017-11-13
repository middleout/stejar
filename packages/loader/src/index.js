export { animateInLoader, animateOutLoader, display, hideLoader, showLoader } from "./actions";
export {
    ANIMATE_IN_LOADER_ACTION,
    ANIMATE_OUT_LOADER_ACTION,
    DISPLAY_LOADER_ACTION,
    HIDE_LOADER_ACTION,
} from "./actionTypes";
export { loaderReducer } from "./reducer";
export {
    getAnimateLoader,
    getDisplayLoader,
    getLoaderAnimateInDuration,
    getLoaderAnimateOutDuration,
} from "./selectors";
export {
    getMountPoint,
    setMountPoint,
    setStateSelector,
    getStateSelector,
    setActionsPrefix,
    getActionsPrefix,
    getDefaultState,
    setDefaultState,
} from "./settings";
