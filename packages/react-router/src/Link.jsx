import { Component } from "react";
import { withRouter } from "./withRouter";

function onClick(router, to, params, query, onClick, event) {
    event.preventDefault();
    router.redirect(to, params, query);
    if (onClick) {
        onClick(event);
    }
}

@withRouter
export class Link extends Component {
    render() {
        return (
            <a
                onClick={onClick.bind(
                    null,
                    this.props.routing.router,
                    this.props.to,
                    this.props.params,
                    this.props.query,
                    this.props.onClick
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
