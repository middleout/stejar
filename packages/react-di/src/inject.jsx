import hoistStatics from "hoist-non-react-statics";
import { Component, createElement } from "react";
import { getDisplayName } from "./getDisplayName";
import { withServiceManager } from "./withServiceManager";

/**
 * A public Higher Order Component to inject specific Service Manager
 * dependencies inside a component via props
 *
 * @param mapItemsToProps
 * @returns {(WrappedComponent:any)=>any}
 */
export function inject(mapItemsToProps) {
    return function wrapWithConnect(WrappedComponent) {
        const displayName = `Inject(${getDisplayName(WrappedComponent)})`;

        @withServiceManager
        class Inject extends Component {
            /**
             * @type {string}
             */
            static displayName = displayName;

            /**
             * @type {any}
             */
            static WrappedComponent = WrappedComponent;

            render() {
                const data = {};
                Object.keys(mapItemsToProps).forEach(key => {
                    data[key] = this.props.serviceManager.get(mapItemsToProps[key]);
                });

                return createElement(WrappedComponent, { ...this.props, ...data });
            }
        }

        return hoistStatics(Inject, WrappedComponent);
    };
}
