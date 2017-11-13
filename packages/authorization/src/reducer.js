import {
    LOADED_PERMISSIONS_ACTION,
    LOADED_RESOURCES_ACTION,
    LOADED_ROLES_ACTION,
    ADDED_PERMISSION_ACTION,
} from "./actionTypes";

/**
 * @type {{rules: Array, roles: Array, resources: Array}}
 */
const defaultState = {
    rules: [],
    roles: [],
    resources: [],
};

export function authorizationReducer(state = defaultState, action) {
    switch (action.type) {
        case LOADED_PERMISSIONS_ACTION:
            return { ...state, rules: action.payload };
        case LOADED_RESOURCES_ACTION:
            return { ...state, resources: action.payload };
        case LOADED_ROLES_ACTION:
            return { ...state, roles: action.payload };
        case ADDED_PERMISSION_ACTION:
            return { ...state, rules: state.rules.concat(action.payload) };
        default:
            return state;
    }
}
