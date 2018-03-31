import { serial } from "items-promise";

export function routerMiddlewareRunnerFactory(stateAdapter, fetchMiddleware, options = {}) {
    if (typeof fetchMiddleware !== "function") {
        throw new Error("FetchMiddleware must be a function");
    }

    return function routerMiddleware(match) {
        const promises = match
            .getRoutes()
            .map(item => fetchMiddleware(item.getOptions()))
            .filter(i => !!i);

        const args = [stateAdapter.getPreviousMatch() || null, stateAdapter.hydrate(match), options];
        return serial(promises, item => item(...args)).then(() => {
            stateAdapter.update(match);
            return match;
        });
    };
}

export function routerMiddleware(stateAdapter, options = {}) {
    let fetchMiddleware = routeOptions => routeOptions["middleware"];
    return routerMiddlewareRunnerFactory(stateAdapter, fetchMiddleware, options);
}
