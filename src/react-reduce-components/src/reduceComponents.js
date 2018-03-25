import { createElement } from "react";

export function reduceComponents(components) {
    return components.reverse().reduce((accumulator, current) => {
        if (!accumulator) {
            return createElement(current);
        }

        return createElement(current, {}, accumulator);
    }, null);
}
