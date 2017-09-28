import { Component } from "react";
import PropTypes from "prop-types";

export class NotFoundRedirectRoute extends Component {
    static propTypes = {
        redirect: PropTypes.bool,
        notFound: PropTypes.bool,
        toName: PropTypes.string.isRequired,
        toParams: PropTypes.object,
        onEnter: PropTypes.func,
        onChange: PropTypes.func,
        eventsHandler: PropTypes.func,
    };

    render() {
        console.error("NotFoundRedirectRoute route should not render");
        return null;
    }
}
