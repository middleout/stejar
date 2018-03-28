import { createElement } from "react";

export function reduceComponents(components, props = {}) {
    return components.reverse().reduce((accumulator, current) => {
        if (!accumulator) {
            return createElement(current, props);
        }

        return createElement(current, props, accumulator);
    }, null);
}
