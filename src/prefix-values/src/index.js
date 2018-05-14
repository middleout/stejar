export function prefixValues(prefix, object, separator = "/") {
    let ret = {};

    Object.keys(object).forEach(key => {
        ret[key] = prefix + separator + object[key];
    });

    return ret;
}
