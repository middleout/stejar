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
export function inject<P>(mapItemsToProps: P) {
    return function wrapWithConnect(WrappedComponent: any) {
        const displayName = `Inject(${getDisplayName(WrappedComponent)})`;

        @withServiceManager
        class Inject extends Component<any, any> {
            /**
             * @type {string}
             */
            static displayName: string = displayName;

            /**
             * @type {any}
             */
            static WrappedComponent: any = WrappedComponent;

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
