import { Component } from "react";
import PropTypes from "prop-types";

export class Route extends Component {
    render() {
        const { children } = this.props;

        return <div>{children}</div>;
    }
}

Route.propTypes = {
    path: PropTypes.string,
    name: PropTypes.string,
    component: PropTypes.func,
    onEnter: PropTypes.func,
};
