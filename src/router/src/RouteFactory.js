import { Route } from "./Route";

export class RouteFactory {
    static build(router, definition, options = {}) {
        const route = new Route({
            name: definition.name,
            path: definition.path,
            component: definition.component,
            middleware: definition.middleware,
            match: definition.match,
            type: definition.type,
            serviceManager: options.serviceManager,
            options: {
                $redirectionDetails: definition.to,
            },
        });

        if (definition.routes) {
            route.attachChildren(
                definition.routes.map(childDefinition => RouteFactory.build(router, childDefinition, options))
            );
        }

        return route;
    }
}
