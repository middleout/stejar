import { Component } from "react";
// import PropTypes from "prop-types";

export class NotFoundRoute extends Component {
    render() {
        const x = "TEMPORARY2";
        const { children } = this.props;

        return (
            <div>
                {children} {x}
            </div>
        );
    }
}

NotFoundRoute.propTypes = {};
