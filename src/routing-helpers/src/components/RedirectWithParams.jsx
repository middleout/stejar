import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import PropTypes from "prop-types";
import { RouterContext } from "./RouterContextProvider";
import { route } from "../helpers/route";

RedirectWithParams.propTypes = {
    exact: PropTypes.bool,
    from: PropTypes.string,
    name: PropTypes.string.isRequired,
    params: PropTypes.object,
    query: PropTypes.object,
};

export function RedirectWithParams({ exact, from, name, params, query }) {
    const { routes } = useContext(RouterContext);

    return (
        <Route
            exact={exact}
            from={from}
            render={({ match }) => <Redirect to={route(routes, name, { ...match.params, ...params }, query)} />}
        />
    );
}
