import { Component } from "react";
import PropTypes from "prop-types";

export class IndexRedirectRoute extends Component {
    static propTypes = {
        name: PropTypes.string,
        index: PropTypes.bool, // Automatically set to true
        redirect: PropTypes.bool, // Automatically set to true
        path: PropTypes.string,
        toName: PropTypes.string,
        toParams: PropTypes.object,
        toQuery: PropTypes.object,
        onEnter: PropTypes.func,
        onChange: PropTypes.func,
        eventsHandler: PropTypes.func,
        keepOldParams: PropTypes.bool,
        keepOldQuery: PropTypes.bool,
    };

    render() {
        console.error("IndexRedirectRoute route should not render");
        return null;
    }
}
