import { Component } from "react";
import PropTypes from "prop-types";

export class NotFoundRoute extends Component {
    static propTypes = {
        notFound: PropTypes.bool,
    };

    render() {
        const { children } = this.props;
        return <div>{children}</div>;
    }
}
