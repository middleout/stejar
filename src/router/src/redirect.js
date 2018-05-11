import { buildPath } from "./buildPath";

export function redirect(history, currentRoute, routes, to = null, params = {}, query = {}, options = {}) {
    history.push(buildPath(currentRoute, routes, to, params, query, options), options);
}
