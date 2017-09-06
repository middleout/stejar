import { Component } from "react";
// import PropTypes from "prop-types";

export class NotFoundRedirectRoute extends Component {
    render() {
        console.error("NotFoundRedirectRoute route should not render");
        return null;
    }
}

NotFoundRedirectRoute.propTypes = {};
