export function isExpression(value) {
    return typeof value === "object" && value.$raw === true;
}

export function createExpression(value) {
    return {
        $raw: true,
        getValue: () => value,
    };
}
