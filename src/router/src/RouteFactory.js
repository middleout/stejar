import { Route } from "./Route";

export class RouteFactory {
    static build(router, definition, options = {}) {
        const { name, path, match, type, serviceManager, routes = [], to, ...routeOptions } = definition;

        const route = new Route({
            name,
            path,
            match,
            type,
            serviceManager,
            options: {
                ...routeOptions,
                $redirectionDetails: to,
            },
        });

        route.attachChildren(
            routes.map(childDefinition => RouteFactory.build(router, { ...childDefinition, serviceManager }, options))
        );
        return route;
    }
}
