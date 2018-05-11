import React, { createElement } from "react";
import { RouterContextConsumer } from "./RouterProvider";

export function provideRouter(WrappedComponent) {
    return function ComponentWithRouter(props) {
        return (
            <RouterContextConsumer>
                {router =>
                    createElement(WrappedComponent, {
                        ...props,
                        router,
                    })
                }
            </RouterContextConsumer>
        );
    };
}
