import { generatePath } from "react-router-dom";
import { toQueryString } from "./toQueryString";

export function route(routes, name, params = {}, query = {}) {
    if (!routes[name]) {
        throw new Error(`Route with name "${name}" does not exist`);
    }
    return generatePath(routes[name], params) + toQueryString(query);
}
