import { enforceConstraints, parser } from "./parser";

export function reverseRoute(route, name, params = {}, query = {}) {
    const initialName = name;
    const childrenNames = name.split(".");
    name = childrenNames.shift();

    if (childrenNames.filter(item => !item).length > 0) {
        throw new Error(`Reversing route to an invalid name ending in a dot or 2 dots: "${initialName}"`);
    }

    if (!route.name) {
        return reverseChildren(route.children, [name].concat(childrenNames).join("."), params, query);
    }

    if (route.name !== name) {
        return false;
    }

    params = enforceConstraints(params, route.constraints);
    if (!params) {
        return false;
    }

    const routePath = route.path(params, query);
    if (!routePath) {
        return false;
    }

    const path = parser(routePath).stringify(params);

    if (childrenNames.length === 0) {
        return path;
    }

    const childrenPath = reverseChildren(route.children, childrenNames.join("."), params, query);
    if (childrenPath) {
        return path + (path === "/" ? "" : "/") + childrenPath;
    }

    return false;
}

function reverseChildren(routes, name, params, query) {
    for (let route of routes) {
        const url = reverseRoute(route, name, params, query);

        if (url) {
            return url;
        }
    }

    return false;
}
