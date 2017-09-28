import { Component } from "react";
// import PropTypes from "prop-types";

export class NotFoundRedirectRoute extends Component {
    static propTypes = {};

    render() {
        console.error("NotFoundRedirectRoute route should not render");
        return null;
    }
}
