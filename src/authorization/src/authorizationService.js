export function authorizationService(storageAdapter) {

    return {
        addResource(resource) {
            let resources = storageAdapter.getResources();
            if (resources.map(i => i.resource).includes(resource)) {
                throw new Error(`Resource "${resource}" already exists`);
            }

            storageAdapter.addResource(resource);
        },
        addRole(role) {
            let roles = storageAdapter.getRoles();
            if (roles.map(i => i.role).includes(role)) {
                throw new Error(`Role "${role}" already exists`);
            }

            storageAdapter.addRole(role);
        },
        allow(role, resource) {
            let rules = storageAdapter.getRules();

            for (let offset in rules) {
                const rule = rules[offset];

                if (rule.ruleType === "allow" && rule.role === role && rule.resource === resource) {
                    return;
                }

                if (rule.ruleType === "deny" && rule.role === role && rule.resource === resource) {
                    storageAdapter.removeRule("deny", role, resource);
                }
            }

            return storageAdapter.addRule("allow", role, resource);
        },
        deny(role, resource) {
            let rules = storageAdapter.getRules();

            for (let offset in rules) {
                const rule = rules[offset];

                if (rule.ruleType === "deny" && rule.role === role && rule.resource === resource) {
                    return;
                }

                if (rule.ruleType === "allow" && rule.role === role && rule.resource === resource) {
                    storageAdapter.removeRule("allow", role, resource);
                }
            }

            return storageAdapter.addRule("deny", role, resource);
        },
        isAllowed(role, resource) {
            const resources = storageAdapter.getResources();
            const roles = storageAdapter.getRoles();
            const rules = storageAdapter.getRules();

            if (!resources.map(i => i.resource).includes(resource)) {
                throw new Error(`Resource "${resource}" does not exist`);
            }

            if (!roles.map(i => i.role).includes(role)) {
                throw new Error(`Role "${role}" does not exist`);
            }

            let isAllowed = undefined;
            rules.forEach(rule => {
                if (rule.ruleType === "allow") {
                    if (rule.resource == resource) {
                        if (rule.role == role) {
                            isAllowed = true;
                        }
                    }
                }

                if (rule.ruleType === "deny") {
                    if (rule.resource == resource) {
                        if (rule.role == role) {
                            isAllowed = false;
                        }
                    }
                }
            });

            return !!isAllowed;
        },
    };
}
