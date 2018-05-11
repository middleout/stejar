import { createElement } from "react";
import { withServiceManager } from "./withServiceManager";

export function inject(mapItemsToProps) {
    return function wrapWithInject(WrappedComponent) {
        function wrappedWithInject(props) {
            const container = {};
            Object.keys(mapItemsToProps).forEach(key => {
                container[key] = props.serviceManager.get(mapItemsToProps[key]);
            });

            let newProps = { ...props };
            delete newProps.serviceManager;

            return createElement(WrappedComponent, { ...newProps, ...container });
        }

        return withServiceManager(wrappedWithInject);
    };
}
