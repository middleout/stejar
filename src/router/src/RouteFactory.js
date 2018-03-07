import { Route } from "./Route";

export class RouteFactory {
    static build(router, definition, options = {}) {
        if (definition.type === Route.TYPE_REDIRECT) {
            definition.middleware = () => {
                router.navigate(
                    definition.to.name,
                    definition.to.params || {},
                    definition.to.query || {},
                    definition.to.options || {}
                );
                return new Promise(() => null);
            };
        }

        const route = new Route({
            name: definition.name || null,
            path: definition.path || null,
            component: definition.component || null,
            middleware: definition.middleware || null,
            match: definition.match || Route.MATCH_STANDARD,
            serviceManager: options.serviceManager || null,
        });

        if (definition.routes) {
            route.attachChildren(
                definition.routes.map(childDefinition => RouteFactory.build(router, childDefinition, options))
            );
        }

        return route;
    }
}
