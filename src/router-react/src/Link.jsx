import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "./withRouter";

function onClick(router, to, params, query, onClick, options, props, event) {
    event.preventDefault();
    router.navigate(to, params, query, options);
    if (onClick) {
        onClick(event, props);
    }
}

@withRouter
export class Link extends Component {
    /**
     * @type {{routing: *, children: *, className: shim, onClick: shim, query: shim, params: shim, to: shim}}
     */
    static propTypes = {
        router: PropTypes.object.isRequired,
        children: PropTypes.any.isRequired,
        className: PropTypes.string,
        onClick: PropTypes.func,
        query: PropTypes.object,
        params: PropTypes.object,
        to: PropTypes.string,
        reuseParams: PropTypes.bool,
        reuseQuery: PropTypes.bool,
    };

    render() {
        const routerOptions = {};
        if (typeof this.props.reuseParams !== "undefined") {
            routerOptions.reuseParams = !!this.props.reuseParams;
        }
        if (typeof this.props.reuseQuery !== "undefined") {
            routerOptions.reuseQuery = !!this.props.reuseQuery;
        }

        return (
            <a
                onClick={onClick.bind(
                    null,
                    this.props.router,
                    this.props.to,
                    this.props.params,
                    this.props.query,
                    this.props.onClick,
                    routerOptions,
                    this.props
                )}
                href={this.props.router.buildPath(this.props.to, this.props.params, this.props.query, routerOptions)}
                className={this.props.className || ""}>
                {this.props.children}
            </a>
        );
    }
}
