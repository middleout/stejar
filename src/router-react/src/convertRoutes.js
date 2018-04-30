import invariant from "invariant";
import { Children } from "react";
import { Route as RouterRoute } from "@stejar/router";
import { Index } from "./Index";
import { IndexRedirect } from "./IndexRedirect";
import { Redirect } from "./Redirect";
import { Route } from "./Route";

export function convertRoutes(routes) {
    if (!Array.isArray(routes)) {
        routes = [routes];
    }
    const x = processRoutes(routes);

    return x;
}

function processRoutes(routes) {
    let jsRoutes = [];

    routes.forEach(route => {
        let parsedRoute = {};

        const { children, ...props } = route.props;

        switch (route.type) {
            case Route:
                parsedRoute = { ...props };
                break;
            case Index: {
                const { path, ...remaining } = props;
                invariant(
                    !path,
                    `An "Index" route *cannot* have a "path" prop because it already matches the parent path.`
                );

                parsedRoute = {
                    ...remaining,
                    path,
                    match: RouterRoute.MATCH_EXACT,
                };
                break;
            }
            case Redirect: {
                const { path, toName, toParams, toQuery, ...remaining } = props;
                invariant(path, `A "Redirect" route *requires* a "path" prop in order to know how to match.`);

                parsedRoute = {
                    ...remaining,
                    path,
                    type: RouterRoute.TYPE_REDIRECT,
                    to: {
                        name: toName,
                        params: toParams,
                        query: toQuery,
                    },
                };
                break;
            }
            case IndexRedirect: {
                const { path, toName, toParams, toQuery, ...remaining } = props;
                invariant(
                    !path,
                    `An "IndexRedirect" route *cannot* have a "path" prop because it already matches the parent path.`
                );

                parsedRoute = {
                    ...remaining,
                    path,
                    match: RouterRoute.MATCH_EXACT,
                    type: RouterRoute.TYPE_REDIRECT,
                    to: {
                        name: toName,
                        params: toParams,
                        query: toQuery,
                    },
                };
                break;
            }
        }

        if (Children.count(children) > 0) {
            parsedRoute.routes = processRoutes(Array.isArray(children) ? children : [children]);
        }

        jsRoutes.push(parsedRoute);
    });

    return jsRoutes;
}
