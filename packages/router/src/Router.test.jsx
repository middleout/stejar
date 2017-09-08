import { Router } from "./Router";
import { createServerHistory } from "./serverHistory";

test("Should be able to render a route", done => {
    const serverHistory = createServerHistory("/", "", () => null);
    const router = new Router(serverHistory);
    router.add({
        path: "/",
        name: "base",
    });

    const onDone = () => {
        expect(router.getMatchedRouteName()).toEqual("base");
        done();
    };

    router.start(onDone);
});

test("Should be able to set a generic option on the router", done => {
    const serverHistory = createServerHistory("/foo/bar", "", () => null);
    const router = new Router(serverHistory);

    router.setOptions({
        foo: "bar",
    });

    expect(router.getOptions()["foo"]).toEqual("bar");
    done();
});

test("Should be able to render a route with children", done => {
    const serverHistory = createServerHistory("/foo/bar", "", () => null);
    const router = new Router(serverHistory);
    router.add({
        path: "/",
        name: "base",
        children: [
            {
                path: "foo",
                name: "foo",
                children: [
                    {
                        path: "bar",
                        name: "bar",
                    },
                ],
            },
        ],
    });

    const onDone = () => {
        expect(router.getMatchedRouteName()).toEqual("base.foo.bar");
        done();
    };

    router.start(onDone);
});

test("Should not be able to start 2 times", done => {
    const serverHistory = createServerHistory("/", "", () => null);
    const router = new Router(serverHistory);

    let inc = 0;
    const onDone = () => inc++;

    router.start(onDone);
    router.start(onDone);

    // jest.useFakeTimers();

    setTimeout(() => {
        try {
            expect(inc).toEqual(1);
        } catch (err) {
            done.fail(err);
        }
        done();
    });
    // jest.runAllTimers();
});
