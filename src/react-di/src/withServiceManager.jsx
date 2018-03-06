import React, { createElement } from "react";
import { ServiceContextConsumer } from "./ServiceProvider";

export function withServiceManager(WrappedComponent) {
    return function wrapWithServiceManager(props) {
        return (
            <ServiceContextConsumer>
                {serviceManager => createElement(WrappedComponent, { ...props, serviceManager: serviceManager })}
            </ServiceContextConsumer>
        );
    };
}
