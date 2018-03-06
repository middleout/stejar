import { Route } from "./Route";

export class RouteFactory {
    /**
     * @param definition
     * @param parent
     * @returns {Route}
     */
    static build(router, definition, parent) {
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
            parent: parent || null,
        });

        if (definition.routes) {
            route.attachChildren(
                definition.routes.map(childDefinition => RouteFactory.build(router, childDefinition, route))
            );
        }

        return route;
    }
}
