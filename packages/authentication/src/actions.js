import { AUTHENTICATED_ACTION, LOGOUT_ACTION } from "./actionTypes";
import { createAction } from "../ModuleConfig/createAction";

export const authenticated = identity => createAction(AUTHENTICATED_ACTION, identity);
export const logout = () => createAction(LOGOUT_ACTION);
