import React, { createElement } from "react";
import { ServiceConsumer } from "./ServiceProvider";

export function withServiceManager(WrappedComponent) {
    return function wrapWithServiceManager(props) {
        return (
            <ServiceConsumer>
                {serviceManager => createElement(WrappedComponent, { ...props, serviceManager: serviceManager })}
            </ServiceConsumer>
        );
    };
}
