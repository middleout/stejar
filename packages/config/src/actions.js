import { SET_CONFIG } from "./actionTypes";
import { createAction } from "@stejar/redux-module/createAction";

export const setConfig = config => createAction(SET_CONFIG, config);
