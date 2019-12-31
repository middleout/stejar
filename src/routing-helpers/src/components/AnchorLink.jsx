import React from "react";
import PropTypes from "prop-types";
import { RouteLink } from "./RouteLink";

AnchorLink.propTypes = {
    to: PropTypes.string,
    params: PropTypes.object,
    query: PropTypes.object,
    children: PropTypes.node.isRequired,
};

export function AnchorLink({ to, params, query, children, ...props }) {
    return (
        <RouteLink name={to} params={params} query={query} {...props}>
            {({ to, ...props }) => (
                <a href={to} {...props}>
                    {children}
                </a>
            )}
        </RouteLink>
    );
}
