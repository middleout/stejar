import { serial } from "items-promise";

export function routerMiddlewareRunnerFactory(fetchMiddleware, options = {}) {
    if (typeof fetchMiddleware !== "function") {
        throw new Error("FetchMiddleware must be a function");
    }

    return match => {
        const promises = match.routes.map(item => fetchMiddleware(item)).filter(i => !!i);
        return serial(promises, item => {
            return item(match, options).then(result => {
                if (result && result.default) {
                    return result.default(match, options);
                }

                return result;
            });
        }).then(() => match);
    };
}

export function routerMiddleware(options = {}) {
    let fetchMiddleware = route => route.middleware;
    return routerMiddlewareRunnerFactory(fetchMiddleware, options);
}
