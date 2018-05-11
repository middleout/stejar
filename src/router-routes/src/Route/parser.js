import RouteParser from "url-pattern";

export function parser(path) {
    const charset = "a-zA-Z0-9_-";
    return new RouteParser(path, { segmentNameCharset: charset });
}

export function enforceConstraints(params, constraints) {
    for (const paramName of Object.keys(constraints)) {
        if (params[paramName]) {
            const regex = new RegExp(constraints[paramName]);
            if (!params[paramName].match(regex)) {
                return false;
            }
        }
    }

    return params;
}
