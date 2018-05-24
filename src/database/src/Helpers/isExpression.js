export function isExpression(value) {
    if (value === null) {
        return false;
    }

    return typeof value === "object" && value.$raw === true;
}
