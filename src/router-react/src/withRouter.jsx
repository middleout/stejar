import React, { PureComponent } from "react";
import hoistStatics from "hoist-non-react-statics";
import { Router } from "@stejar/router";
import { provideRouter } from "./provideRouter";

export function withRouter(WrappedComponent) {
    @provideRouter
    class WithRouter extends PureComponent {
        constructor(props) {
            super(props);
            this.unlisten = () => null;
        }

        render() {
            const props = { ...this.props };

            return <WrappedComponent {...props} />;
        }

        componentDidMount() {
            const router = this.props.router;
            this.unlisten = router.subscribe(Router.MATCHED_EVENT, () => this.forceUpdate());
        }

        componentWillUnmount() {
            this.unlisten();
        }
    }

    return hoistStatics(WithRouter, WrappedComponent);
}
