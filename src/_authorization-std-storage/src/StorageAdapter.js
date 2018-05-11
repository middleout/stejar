export function StorageAdapter() {
    let resources = [];
    let roles = [];
    let rules = [];

    return {
        addResource(resource) {
            resources.push({
                resource,
            });
        },
        addRole(role) {
            roles.push({
                role,
            });
        },
        getResources() {
            return resources;
        },
        getRoles() {
            return roles;
        },
        getRules() {
            return rules;
        },
        addRule(ruleType, role, resource) {
            rules.push({
                ruleType,
                role,
                resource,
            });
        },
        removeRule(ruleType, role, resource) {
            rules = rules.filter(rule => {
                if (rule.type == ruleType && rule.role == role && rule.resource == resource) {
                    return false;
                }

                return true;
            });
        },
    };
}
