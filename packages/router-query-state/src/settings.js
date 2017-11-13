import { createModule } from "@stejar/redux-module/createModule";

const module = createModule("@stejar/router/globalState", {
    generateDefaultState: true,
    defaultState: { queryParam: "_gs" },
});

export const getMountPoint = module.getMountPoint;
export const setMountPoint = module.setMountPoint;
export const setStateSelector = module.setStateSelector;
export const getStateSelector = module.getStateSelector;
export const setActionsPrefix = module.setActionsPrefix;
export const getActionsPrefix = module.getActionsPrefix;
export const getDefaultState = module.getDefaultState;
export const setDefaultState = module.setDefaultState;
