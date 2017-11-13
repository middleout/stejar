import { createModule } from "@stejar/redux-module/createModule";

let defaultDuration = 200;
let defaultState = {};
const module = createModule("@stejar/loader", { generateDefaultState: true, defaultState });

export function setDefaultDuration(newDefaultDuration) {
    defaultDuration = newDefaultDuration;
}

export function getDefaultDuration() {
    return defaultDuration;
}

export function bootLoaders(...loaders) {
    loaders.forEach(loader => {
        if (typeof loader === "string") {
            defaultState[loader] = {
                display: false,
                animate: false,
                animateInDuration: getDefaultDuration(),
                animateOutDuration: getDefaultDuration(),
            };
        } else {
            Object.keys(loader).forEach(loaderName => {
                if (typeof loader[loaderName] === "boolean") {
                    defaultState[loaderName] = {
                        display: loader[loaderName],
                        animate: loader[loaderName],
                        animateInDuration: getDefaultDuration(),
                        animateOutDuration: getDefaultDuration(),
                    };
                } else {
                    defaultState[loaderName] = loader[loaderName];
                }
            });
        }
    });
}

export const getMountPoint = module.getMountPoint;
export const setMountPoint = module.setMountPoint;
export const setStateSelector = module.setStateSelector;
export const getStateSelector = module.getStateSelector;
export const setActionsPrefix = module.setActionsPrefix;
export const getActionsPrefix = module.getActionsPrefix;
export const getDefaultState = module.getDefaultState;
export const setDefaultState = module.setDefaultState;
