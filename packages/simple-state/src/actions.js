import { SET_STATE_ACTION } from "./actionTypes";
import { createAction } from "@stejar/redux-module/createAction";

export const setState = (key, state) => createAction(SET_STATE_ACTION, { key, state });
