import { Component } from "react";
import PropTypes from "prop-types";

export class IndexRoute extends Component {
    static propTypes = {
        index: PropTypes.bool,
        component: PropTypes.func.isRequired,
        onEnter: PropTypes.func,
        onChange: PropTypes.func,
        eventsHandler: PropTypes.func,
    };

    render() {
        const { children } = this.props;

        return <div>{children}</div>;
    }
}
