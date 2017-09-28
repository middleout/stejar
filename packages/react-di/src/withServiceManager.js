import hoistStatics from "hoist-non-react-statics";
import invariant from "invariant";
import { Component, createElement } from "react";
import { getDisplayName } from "./getDisplayName";
import { shape } from "./shape";

/**
 * A public Higher Order Component to inject the Service Manager
 * inside a component via props
 *
 * @param WrappedComponent
 * @returns {*}
 */
export function withServiceManager(WrappedComponent) {
    const displayName = `WithServiceManager(${getDisplayName(WrappedComponent)})`;

    class WithServiceManager extends Component {
        /**
         * @type {string}
         */
        static displayName = displayName;

        /**
         * @type {any}
         */
        static WrappedComponent = WrappedComponent;

        /**
         * @type {{serviceManager: Requireable<any>}}
         */
        static contextTypes = {
            serviceManager: shape,
        };

        /**
         * @type {{serviceManager: Requireable<any>}}
         */
        static propTypes = {
            serviceManager: shape,
        };

        /**
         * @type {ServiceManager}
         */
        _serviceManager = null;

        /**
         * @param props
         * @param context
         */
        constructor(props, context) {
            super(props, context);
            this._serviceManager = props.serviceManager || context.serviceManager;

            invariant(
                this._serviceManager,
                `Could not find "serviceManager" in either the context or ` +
                    `props of "${displayName}". ` +
                    `Either wrap the root component in a <Provider>, ` +
                    `or explicitly pass "serviceManager" as a prop to "${displayName}".`
            );
        }

        render() {
            return createElement(WrappedComponent, { ...this.props, serviceManager: this._serviceManager });
        }
    }

    return hoistStatics(WithServiceManager, WrappedComponent);
}
