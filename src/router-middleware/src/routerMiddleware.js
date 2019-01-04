import { serial } from "items-promise";
// a very small change to force publish

export function routerMiddlewareRunnerFactory(fetchMiddleware, options = {}) {
    if (typeof fetchMiddleware !== "function") {
        throw new Error("FetchMiddleware must be a function");
    }

    return match => {
        const promises = match.routes.map(item => fetchMiddleware(item)).filter(i => !!i);
        return serial(promises, item => item(match, options));
    };
}

export function routerMiddleware(options = {}) {
    let fetchMiddleware = route => route.middleware;
    return routerMiddlewareRunnerFactory(fetchMiddleware, options);
}
