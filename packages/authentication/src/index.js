export { authenticated, logout } from "./actions";
export { AUTHENTICATED_ACTION, LOGOUT_ACTION } from "./actionTypes";
export { authReducer } from "./reducer";
export { hasIdentity, getIdentity } from "./selectors";
export {
    getActionsPrefix,
    setActionsPrefix,
    getStateSelector,
    setStateSelector,
    setMountPoint,
    getMountPoint,
} from "./settings";
