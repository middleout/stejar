export function makeAsyncMiddlewares(map) {
    const middlewares = {};
    Object.keys(map).forEach(key => {
        middlewares[key] = makeMiddleware(map[key], key);
    });

    return middlewares;
}

function makeMiddleware(importer, name = "default") {
    return function middleware(routeMatch, container) {
        return importer()
            .then(module => module[name](routeMatch, container))
            .then(component => {
                const singleRoute = routeMatch.routes.find(item => item.middleware === middleware);
                if (!singleRoute.component && component) {
                    singleRoute.component = component;
                }
            });
    };
}
