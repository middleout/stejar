export function createServerHistory(url, search, push) {
    return {
        push: push,
        listen: function listen() {},
        location: {
            pathname: url,
            search: search
        }
    };
}