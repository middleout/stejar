import Component from "react";
import { withRouter } from "./withRouter";

function onClick(router, to, params, query, event) {
    event.preventDefault();
    router.redirect(to, params, query);
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
                    this.props.query
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
