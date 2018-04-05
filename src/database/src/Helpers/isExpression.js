export function isExpression(value) {
    return typeof value === "object" && value.$raw === true;
}
