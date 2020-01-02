import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { matchPath } from "react-router-dom";
import { toQueryObject } from "../helpers/toQueryObject";
import { RouterContextProvider } from "./RouterContextProvider";

RouterAdapter.propTypes = {
    children: PropTypes.node,
    history: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired,
};

export function RouterAdapter({ children, history, routes, options = {} }) {
    routes = parseRoutes(routes);

    const initialMatch = match({
        routes,
        pathname: history.location.pathname,
        query: toQueryObject(history.location.search),
    });

    const [state, setState] = useState(initialMatch);
    function syncAction(payload) {
        setState(payload);
    }

    const willMount = useRef(true);
    if (willMount.current) {
        history.listen(({ pathname, search }) => {
            const result = match({
                routes,
                pathname,
                query: toQueryObject(search),
            });

            syncAction(result);
            if (options.syncAction) {
                options.syncAction(result);
            }
        });

        if (options.syncAction) {
            options.syncAction(state);
        }
    }
    useEffect(() => {
        willMount.current = false;
    }, []);

    return (
        <RouterContextProvider state={state} routes={routes}>
            {children}
        </RouterContextProvider>
    );
}

function parseRoutes(routes) {
    let namedRoutes = {};
    if (Array.isArray(routes)) {
        routes.forEach(path => {
            namedRoutes[path] = path;
        });
    } else {
        namedRoutes = routes;
    }

    return namedRoutes;
}

function match({ routes, pathname, query }) {
    for (let name of Object.keys(routes)) {
        const match = matchPath(pathname, { path: routes[name], exact: true });
        if (match) {
            return { name, params: match.params, query };
        }
    }

    return { name: null, params: {}, query: {} };
}
