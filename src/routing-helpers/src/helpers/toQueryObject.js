import qs from "qs";

export function toQueryObject(queryString) {
    return qs.parse(queryString.replace("?", ""));
}
