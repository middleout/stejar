import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { route } from "../helpers/route";
import { CustomLink } from "./CustomLink";
import { useQuery } from "../hooks/useQuery";
import { RouterContext } from "./RouterContextProvider";

RouteLink.propTypes = {
    name: PropTypes.string,
    fallbackCurrentRoute: PropTypes.string,
    params: PropTypes.object,
    query: PropTypes.object,
    reuseParams: PropTypes.bool,
    reuseQuery: PropTypes.bool,
    children: PropTypes.func.isRequired,
};

export function RouteLink({
    name = null,
    params = {},
    query = {},
    reuseParams = true,
    reuseQuery = false,
    fallbackCurrentRoute = null,
    children,
    ...props
}) {
    const currentParams = useParams();
    const currentQuery = useQuery();
    const { routes, state } = useContext(RouterContext);
    const finalParams = reuseParams ? { ...currentParams, ...params } : params;
    const finalQuery = reuseQuery ? { ...currentQuery, ...query } : query;

    if (!name) {
        name = state.name;
    }

    if (!name) {
        name = fallbackCurrentRoute;
    }

    const finalProps = { ...props };
    delete finalProps.to;

    return (
        <CustomLink to={route(routes, name, finalParams, finalQuery)} {...finalProps}>
            {children}
        </CustomLink>
    );
}
