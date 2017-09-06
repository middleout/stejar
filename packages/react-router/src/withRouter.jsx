import { PureComponent } from "react";
import hoistStatics from "hoist-non-react-statics";
import { object } from "prop-types";

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export function withRouter(WrappedComponent) {
    class WithRouter extends PureComponent {
        constructor(props, context) {
            super(props, context);
            this.unlisten = () => null;
        }

        render() {
            const router = this.props.router || this.context.router;

            if (!router) {
                return <WrappedComponent {...this.props} />;
            }

            const params = router.getMatchedParams() || {};
            const routing = {
                router,
                params,
            };

            const props = { ...this.props, routing };

            return <WrappedComponent {...props} />;
        }

        componentDidMount() {
            const router = this.props.router || this.context.router;
            if (!router) {
                return;
            }

            this.unlisten = router.subscribe(() => {
                this.forceUpdate();
            });
        }

        componentWillUnmount() {
            this.unlisten();
        }
    }

    WithRouter.contextTypes = {
        router: object,
    };

    WithRouter.displayName = `withRouter(${getDisplayName(WrappedComponent)})`;

    return hoistStatics(WithRouter, WrappedComponent);
}
