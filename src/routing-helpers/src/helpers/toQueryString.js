import qs from "qs";

export function toQueryString(queryObject = {}) {
    if (!queryObject) {
        queryObject = {};
    }

    return (Object.keys(queryObject).length > 0 ? "?" : "") + qs.stringify(queryObject);
}
