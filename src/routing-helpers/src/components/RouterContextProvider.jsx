import React, { createContext } from "react";
import PropTypes from "prop-types";

export const RouterContext = createContext({
    routes: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
});

export function RouterContextProvider({ routes, children, state }) {
    const context = {
        state,
        routes,
    };

    return <RouterContext.Provider value={context}>{children}</RouterContext.Provider>;
}
