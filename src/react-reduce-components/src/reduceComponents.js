import { createElement } from "react";

export function reduceComponents(components, props = {}) {
    const data = components.reverse().reduce((accumulator, current) => {
        if (!accumulator) {
            if (current.component) {
                return {
                    single: true,
                    component: createElement(current.component, props),
                };
            }
            if (current.components) {
                let named = {};
                Object.keys(current.components).forEach(key => {
                    named[key] = createElement(current.components[key], props);
                });

                return {
                    single: false,
                    components: named,
                };
            }
        }

        if (!current.component && !current.components) {
            throw new Error("Either component or components required");
        }

        if (current.component) {
            if (!accumulator.single) {
                return {
                    single: true,
                    component: createElement(current.component, { ...props, ...accumulator.components }),
                };
            }

            return {
                single: true,
                component: createElement(current.component, props, accumulator.component),
            };
        }

        let named = {};
        Object.keys(current.components).forEach(key => {
            if (!accumulator.single) {
                named[key] = createElement(current.components[key], { ...props, ...accumulator.components });
                return;
            }

            named[key] = createElement(current.components[key], props, accumulator.component);
        });

        return {
            single: false,
            components: named,
        };
    }, null);

    if (data.components) {
        throw new Error("Top level component cannot have named components");
    }

    return data.component;
}
