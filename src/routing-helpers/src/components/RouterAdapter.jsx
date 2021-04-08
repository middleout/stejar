import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { matchPath } from "react-router-dom";
import { toQueryObject } from "../helpers/toQueryObject";
import { RouterContext } from "./RouterContextProvider";

RouterAdapter.propTypes = {
    children: PropTypes.node,
    history: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired,
};

export default function RouterAdapter({ children, history, routes, options = {} }) {
    routes = parseRoutes(routes);
    const syncAction = options.syncAction || (() => null);

    const initialMatch = match({
        routes,
        pathname: history.location.pathname,
        query: toQueryObject(history.location.search),
    });

    const [name, setName] = useState(initialMatch.name);
    const [params, setParams] = useState(initialMatch.params);
    const [query, setQuery] = useState(initialMatch.query);

    const willMount = useRef(true);
    if (willMount.current) {
        history.listen(({ pathname, search }) => {
            const result = match({
                routes,
                pathname: pathname,
                query: toQueryObject(search || ""),
            });

            setName(result.name);
            setParams(result.params);
            setQuery(result.query);
            syncAction(result);
        });

        syncAction({ name, params, query });
    }
    useEffect(() => {
        willMount.current = false;
    }, []);

    return <RouterContext.Provider value={{ state: {name, params, query }, routes }}>{children}</RouterContext.Provider>;
}

function parseRoutes(routes) {
    let namedRoutes = {};
    if (Array.isArray(routes)) {
        routes.forEach((path) => {
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
