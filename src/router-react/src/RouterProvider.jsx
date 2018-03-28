import { Component } from "react";
import PropTypes from "prop-types";
import { Router } from "@stejar/router";
import { reduceComponents } from "@stejar/react-reduce-components";

export class RouterProvider extends Component {
    static propTypes = {
        router: PropTypes.object.isRequired,
        onRouteMatch: PropTypes.func,
        match: PropTypes.object,
    };

    state = {
        component: null,
    };

    constructor(props) {
        super(props);
        this._router = props.router;
        this._stop = () => null;
        this._unlisten = () => null;
        if (props.match) {
            this.updateStateComponent(props.match, true);
        }
    }

    getComponentFromMatch(match, props) {
        return reduceComponents(
            match
                .getRoutes()
                .filter(route => !!route.getOptions().component || !!route.getOptions().handler)
                .map(route => route.getOptions().component || route.getOptions().handler),
            props
        );
    }

    updateStateComponent(match, useCurrentState) {
        const component = this.getComponentFromMatch(match, {
            routeMatch: {
                name: match.getName(),
                params: match.getParams(),
                query: match.getQuery(),
            },
        });

        if (useCurrentState) {
            /* eslint-disable react/no-direct-mutation-state */
            this.state = { component };
            return;
        }

        this.setState({
            component,
        });
    }

    /**
     * Render either the match Component (in SSR mode)
     * or the result from the previous dispatch
     */
    render() {
        return this.state.component || null;
    }

    /**
     * We know we are in a browser environment here.
     * SSR already happened (and we already handled it)
     * We can now proceed into starting the router normally
     */
    componentDidMount() {
        this._unlisten = this._router.subscribe(Router.MATCHED_EVENT, match => {
            const onRouteMatch = this.props.onRouteMatch || Promise.resolve();

            // If the component unmounted, do not continue
            if (!this._stop) {
                return;
            }

            onRouteMatch(match).then(() => {
                // If the component unmounted, do not continue
                if (!this._stop) {
                    return;
                }

                this.updateStateComponent(match);
            });
        });

        // TODO: Proper not found ? Using components
        this._router.subscribe(Router.NOT_FOUND_EVENT, () => console.warn("NOT FOUND"));

        this._stop = this._router.start();
    }

    componentWillUnmount() {
        this._unlisten();
        this._stop();
        this._stop = null;
    }
}
