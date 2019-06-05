export function makeAsyncMiddlewares(map) {
    const middlewares = {};
    Object.keys(map).forEach(key => {
        middlewares[key] = makeMiddleware(map[key]);
    });

    return middlewares;
}

function makeMiddleware(importer) {
    return function middleware(routeMatch, container) {
        return importer()
            .then(middleware => middleware(routeMatch, container))
            .then(component => {
                const singleRoute = routeMatch.routes.find(item => item.middleware === middleware);
                if (!singleRoute.component && component) {
                    singleRoute.component = component;
                }
            });
    };
}
