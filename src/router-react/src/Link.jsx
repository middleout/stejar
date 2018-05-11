import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "./withRouter";

const isModifiedEvent = event => !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

const SimpleComponent = class extends Component {
    static displayName = "Link";

    /**
     * @type {{routing: *, children: *, className: shim, onClick: shim, query: shim, params: shim, to: shim}}
     */
    static propTypes = {
        router: PropTypes.object.isRequired,
        children: PropTypes.any.isRequired,
        target: PropTypes.string,
        className: PropTypes.string,
        onClick: PropTypes.func,
        query: PropTypes.object,
        params: PropTypes.object,
        to: PropTypes.string,
        reuseParams: PropTypes.bool,
        reuseQuery: PropTypes.bool,
        innerRef: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    };

    handleClick = event => {
        const { router, to, params, query, reuseParams, reuseQuery, target } = this.props;

        if (this.props.onClick) this.props.onClick(event, this.props);

        if (
            !event.defaultPrevented && // onClick prevented default
            event.button === 0 && // ignore everything but left clicks
            !target && // let browser handle "target=_blank" etc.
            !isModifiedEvent(event) // ignore clicks with modifier keys
        ) {
            event.preventDefault();

            const options = {};
            if (typeof this.props.reuseParams !== "undefined") {
                options.reuseParams = reuseParams;
            }
            if (typeof this.props.reuseQuery !== "undefined") {
                options.reuseQuery = reuseQuery;
            }

            router.redirect(to, params, query, options);
        }
    };

    render() {
        const { router, to, params, query, innerRef, reuseParams, reuseQuery, ...props } = this.props;

        const options = {};
        if (typeof this.props.reuseParams !== "undefined") {
            options.reuseParams = reuseParams;
        }
        if (typeof this.props.reuseQuery !== "undefined") {
            options.reuseQuery = reuseQuery;
        }

        const href = router.buildPath(to, params, query, options);

        return <a {...props} onClick={this.handleClick} href={href} ref={innerRef} />;
    }
};

export default SimpleComponent;

export const Link = withRouter(SimpleComponent);
