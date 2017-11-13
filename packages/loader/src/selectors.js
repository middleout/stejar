import { getStateSelector } from "./settings";

export function getDisplayLoader(loaderName) {
    return state => getStateSelector(state)[loaderName].display;
}

export function getAnimateLoader(loaderName) {
    return state => getStateSelector(state)[loaderName].animate;
}

export function getLoaderAnimateInDuration(loaderName) {
    return state => getStateSelector(state)[loaderName].animateInDuration;
}

export function getLoaderAnimateOutDuration(loaderName) {
    return state => getStateSelector(state)[loaderName].animateOutDuration;
}
