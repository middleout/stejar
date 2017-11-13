import {
    ADDED_PERMISSION_ACTION,
    LOADED_PERMISSIONS_ACTION,
    LOADED_RESOURCES_ACTION,
    LOADED_ROLES_ACTION,
} from "./actionTypes";
import { createAction } from "@stejar/redux-module/createAction";

export const loadedRoles = roles => createAction(LOADED_ROLES_ACTION, roles);
export const loadedResources = resources => createAction(LOADED_RESOURCES_ACTION, resources);
export const loadedPermissions = permissions => createAction(LOADED_PERMISSIONS_ACTION, permissions);
export const addPermission = permission => createAction(ADDED_PERMISSION_ACTION, permission);
