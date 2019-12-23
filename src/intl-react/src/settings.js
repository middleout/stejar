export const defaultReplacer = (text, key, value) => text.replace(":" + key, value);
let replacer = defaultReplacer;

export function changeReplacer(newReplacer) {
    replacer = newReplacer;
}

export function getReplacer() {
    return replacer;
}
