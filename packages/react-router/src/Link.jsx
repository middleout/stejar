import { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "./withRouter";

function onClick(router, to, params, query, onClick, props, event) {
    event.preventDefault();
    router.redirect(to, params, query);
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
        routing: PropTypes.object.isRequired,
        children: PropTypes.any.isRequired,
        className: PropTypes.string,
        onClick: PropTypes.func,
        query: PropTypes.object,
        params: PropTypes.object,
        to: PropTypes.string,
    };

    render() {
        return (
            <a
                onClick={onClick.bind(
                    null,
                    this.props.routing.router,
                    this.props.to,
                    this.props.params,
                    this.props.query,
                    this.props.onClick,
                    this.props
                )}
                href={this.props.routing.router.generatePathFromName(
                    this.props.to,
                    this.props.params,
                    this.props.query
                )}
                className={this.props.className || ""}>
                {this.props.children}
            </a>
        );
    }
}
