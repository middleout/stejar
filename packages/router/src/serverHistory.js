export function createServerHistory(url, search, push) {
    return {
        push,
        listen: () => {},
        location: {
            pathname: url,
            search: search,
        },
    };
}
