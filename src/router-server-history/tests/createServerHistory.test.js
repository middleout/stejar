import { createServerHistory } from "../src";

test("should work", () => {
    const push = () => null;
    const listen = () => null;
    const url = "http://foo.bar";
    const search = "?foo=bar";

    const history = createServerHistory(push, listen, url, search);

    expect(history).toEqual({
        push,
        listen,
        location: {
            pathname: url,
            search: search,
        },
    });
});

test("should work with default search", () => {
    const push = () => null;
    const listen = () => null;
    const url = "http://foo.bar";

    const history = createServerHistory(push, listen, url);

    expect(history).toEqual({
        push,
        listen,
        location: {
            pathname: url,
            search: "",
        },
    });
});
