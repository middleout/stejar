import { getStateSelector } from "./settings";

export function getRoles(state) {
    return getStateSelector(state).roles;
}

export function getResources(state) {
    return getStateSelector(state).resources;
}

export function getRules(state) {
    return getStateSelector(state).rules;
}

export function isAllowed(state, role, resources) {
    const rules = getRules(state);
    if (!Array.isArray(resources)) {
        resources = [resources];
    }

    let overallIsAllowed = true;
    resources.forEach(resource => {
        let isAllowed = true;
        let found = false;

        rules.forEach(rule => {
            if (rule.role === role && rule.resource === resource) {
                found = true;

                if (!rule.allow) {
                    isAllowed = false;
                }
            }
        });

        if (!found || (found && !isAllowed)) {
            overallIsAllowed = false;
        }
    });

    return overallIsAllowed;
}
