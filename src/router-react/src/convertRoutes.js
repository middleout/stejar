import invariant from "invariant";
import { Children } from "react";
import { IndexRoute } from "./IndexRoute";
import { IndexRedirectRoute } from "./IndexRedirectRoute";
import { RedirectRoute } from "./RedirectRoute";
import { Route } from "./Route";

export function convertRoutes(routes) {
    if (!Array.isArray(routes)) {
        routes = [routes];
    }
    return processRoutes(routes);
}

function processRoutes(routes, parent = null) {
    let jsRoutes = [];

    routes.forEach(route => {
        let parsedRoute = {};

        const { children, ...props } = route.props;

        switch (route.type) {
            case Route:
                parsedRoute = { ...props };
                break;
            case IndexRoute: {
                if (!parent) {
                    throw new Error(
                        "Cannot have a root route as an Index(Redirect) route. All Index routes require a parent"
                    );
                }
                if (!parent.name || !parent.path) {
                    throw new Error(
                        "Cannot an Index route with a pathless or unnamed route. All Index routes require a parent with a name and path"
                    );
                }

                const { name, path, ...remaining } = props;
                invariant(
                    !path,
                    `An "Index" route *cannot* have a "path" prop because it already matches the parent path.`
                );
                invariant(
                    !name,
                    `An "Index" route *cannot* have a "name" prop because it is assumed to be the parent name.`
                );

                parsedRoute = {
                    ...remaining,
                    exact: true,
                };
                break;
            }
            case RedirectRoute: {
                const { path, to, params = {}, query = {}, options = {}, ...remaining } = props;
                invariant(path, `A "Redirect" route *requires* a "path" prop in order to know how to match.`);
                invariant(to, `A "Redirect" route *requires* a "to" prop.`);

                parsedRoute = {
                    ...remaining,
                    path,
                    redirect: {
                        to,
                        params,
                        query,
                        options,
                    },
                };
                break;
            }
            case IndexRedirectRoute: {
                if (!parent) {
                    throw new Error(
                        "Cannot have a root route as an Index(Redirect) route. All Index routes require a parent"
                    );
                }
                if (!parent.name || !parent.path) {
                    throw new Error(
                        "Cannot an Index route with a pathless or unnamed route. All Index routes require a parent with a name and path"
                    );
                }

                const { path, to, params = {}, query = {}, options = {}, ...remaining } = props;
                invariant(
                    !path,
                    `An "IndexRedirect" route *cannot* have a "path" prop because it already matches the parent path.`
                );

                invariant(to, `A "Redirect" route *requires* a "to" prop.`);

                parsedRoute = {
                    ...remaining,
                    exact: true,
                    redirect: {
                        to,
                        params,
                        query,
                        options,
                    },
                };
                break;
            }
        }

        if (Children.count(children) > 0) {
            parsedRoute.routes = processRoutes(Array.isArray(children) ? children : [children], parsedRoute);
        }

        jsRoutes.push(parsedRoute);
    });

    return jsRoutes;
}
