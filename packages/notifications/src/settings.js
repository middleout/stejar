import { createModule } from "@stejar/redux-module/createModule";

const module = createModule("@stejar/notifications");

export const getMountPoint = module.getMountPoint;
export const setMountPoint = module.setMountPoint;
export const setStateSelector = module.setStateSelector;
export const getStateSelector = module.getStateSelector;
export const setActionsPrefix = module.setActionsPrefix;
export const getActionsPrefix = module.getActionsPrefix;
