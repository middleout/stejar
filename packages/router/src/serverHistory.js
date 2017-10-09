export function createServerHistory(url, search = "", push = () => null, listen = () => {}) {
    return {
        push,
        listen,
        location: {
            pathname: url,
            search: search,
        },
    };
}
