export function createPathParts(path) {
    if (path === "/") {
        return ["/"];
    }

    const parts = path.split("/");
    return parts.map(item => (item === "" ? "/" : item));
}

export function accumulatePath(path, part) {
    if (part === "/" || path === "/" || path === "") {
        return path + part;
    }

    return path + "/" + part;
}
