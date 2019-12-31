import React from "react";
import PropTypes from "prop-types";
import { RouteLink } from "./RouteLink";

ButtonLink.propTypes = {
    to: PropTypes.string,
    params: PropTypes.object,
    query: PropTypes.object,
    children: PropTypes.node.isRequired,
};

export function ButtonLink({ to, params, query, children, ...props }) {
    return (
        <RouteLink to={to} params={params} query={query} {...props}>
            {props => {
                const newProps = { ...props };
                delete newProps.to;
                return <button {...newProps}>{children}</button>;
            }}
        </RouteLink>
    );
}
