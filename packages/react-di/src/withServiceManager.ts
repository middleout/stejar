import { ServiceManager } from "@stejar/di";
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
 * @returns {any}
 */
export function withServiceManager(WrappedComponent: any): any {
    const displayName = `WithServiceManager(${getDisplayName(WrappedComponent)})`;

    class WithServiceManager extends Component<any, any> {
        /**
         * @type {string}
         */
        static displayName: string = displayName;

        /**
         * @type {any}
         */
        static WrappedComponent: any = WrappedComponent;

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
        protected serviceManager: ServiceManager;

        /**
         * @param props
         * @param context
         */
        constructor(props: any, context: any) {
            super(props, context);
            this.serviceManager = props.serviceManager || context.serviceManager;

            invariant(
                this.serviceManager,
                `Could not find "serviceManager" in either the context or ` +
                    `props of "${displayName}". ` +
                    `Either wrap the root component in a <Provider>, ` +
                    `or explicitly pass "serviceManager" as a prop to "${displayName}".`
            );
        }

        render() {
            return createElement(WrappedComponent, { ...this.props, serviceManager: this.serviceManager });
        }
    }

    return hoistStatics(WithServiceManager, WrappedComponent);
}
