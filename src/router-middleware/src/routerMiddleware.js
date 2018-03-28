import { serial } from "items-promise";
import { ensureRouterMiddlewareAdapterInterop } from "@stejar/interop";

export function routerMiddlewareRunnerFactory(stateAdapter, fetchMiddleware, options = {}) {
    ensureRouterMiddlewareAdapterInterop(stateAdapter);

    if (typeof fetchMiddleware !== "function") {
        throw new Error("FetchMiddleware must be a function");
    }

    return async function routerMiddleware(match) {
        const promises = match
            .getRoutes()
            .map(item => fetchMiddleware(item.getOptions()))
            .filter(i => !!i);

        const args = [stateAdapter.getPreviousMatch() || null, stateAdapter.hydrate(match), options];
        await serial(promises, item => item(...args));
        stateAdapter.update(match);

        return match;
    };
}

export function routerMiddleware(stateAdapter, options = {}) {
    let fetchMiddleware = routeOptions => routeOptions["middleware"];
    return routerMiddlewareRunnerFactory(stateAdapter, fetchMiddleware, options);
}
