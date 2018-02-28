export function createServerHistory(push, listen, url, search = "") {
    return {
        push,
        listen,
        location: {
            pathname: url,
            search: search,
        },
    };
}
