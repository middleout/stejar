export function raw(value) {
    return {
        $raw: true,
        getValue: () => value,
    };
}
