import { Component } from "react";
// import PropTypes from "prop-types";

export class NotFoundRoute extends Component {
    render() {
        const { children } = this.props;

        return <div>{children}</div>;
    }
}

NotFoundRoute.propTypes = {};
