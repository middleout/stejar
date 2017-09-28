import { Component } from "react";
// import PropTypes from "prop-types";

export class IndexRoute extends Component {
    static propTypes = {};

    render() {
        const { children } = this.props;

        return <div>{children}</div>;
    }
}
