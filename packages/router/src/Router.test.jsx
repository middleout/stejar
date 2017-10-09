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
                        children: [
                            {
                                index: true,
                                children: [
                                    {
                                        path: "bar",
                                        name: "bar",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    });

    const onDone = () => {
        expect(router.getMatchedRouteName()).toEqual("base.foo.bar");
        expect(router.currentRouteName).toEqual("base.foo.bar");
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

test("Should be able to have a middleware with before/after", done => {
    const serverHistory = createServerHistory("/foo", "", () => null);
    const router = new Router(serverHistory);
    let counter = 0;

    router.add({
        path: "/",
        name: "base",
        onEnter: (to, next) => {
            expect(counter).toEqual(0);
            counter++;
            return next().then(() => {
                expect(counter).toEqual(3);
                counter++;
            });
        },
        children: [
            {
                path: "foo",
                name: "foo",
                onEnter: (to, next) => {
                    expect(counter).toEqual(1);
                    counter++;
                    return next().then(() => {
                        expect(counter).toEqual(2);
                        counter++;
                    });
                },
            },
        ],
    });

    const onDone = ({ error }) => {
        if (error) {
            return done.fail(error);
        }

        expect(router.getMatchedRouteName()).toEqual("base.foo");
        expect(router.currentRouteName).toEqual("base.foo");
        expect(counter).toEqual(4);
        done();
    };

    router.start(onDone);
});

test("Should be able to have a middleware with before/after onChange", done => {
    let listeners = [];

    function onListen(func) {
        listeners.push(func);
    }

    function onPush(path) {
        listeners.forEach(listener =>
            listener({
                pathname: path,
                search: "",
            })
        );
    }

    const serverHistory = createServerHistory("/foo", "", onPush, onListen);
    const router = new Router(serverHistory);
    let counter = 0;

    router.add({
        path: "/",
        name: "base",
        onEnter: (to, next) => {
            counter++;
            return next().then(() => {
                counter++;
            });
        },
        onChange: (from, to, next) => {
            counter++;
            return next().then(() => {
                counter++;
            });
        },
        children: [
            {
                path: "foo",
                name: "foo",
                onEnter: (to, next) => {
                    counter++;
                    return next().then(() => {
                        counter++;
                    });
                },
                onChange: (from, to, next) => {
                    counter++;
                    return next().then(() => {
                        counter++;
                    });
                },
            },
        ],
    });

    const onDone = ({ error }) => {
        if (error) {
            return done.fail(error);
        }

        expect(router.getMatchedRouteName()).toEqual("base.foo");
        expect(router.currentRouteName).toEqual("base.foo");
        expect(counter).toEqual(4);

        router.subscribe(() => {
            if (router.getMatchedRouteName() === "base") {
                try {
                    expect(counter).toEqual(1);
                    setTimeout(() => {
                        counter = 0;
                        router.redirect("base.foo");
                    }, 100);
                } catch (err) {
                    done.fail(err);
                }
            }

            if (router.getMatchedRouteName() === "base.foo") {
                try {
                    expect(counter).toEqual(2);
                    done();
                } catch (err) {
                    done.fail(err);
                }
            }
        });

        setTimeout(() => {
            counter = 0;
            router.redirect("base");
        }, 100);
    };

    router.start(onDone);
});

test("Should be able to have a middleware with before/after onChange with delay", done => {
    let listeners = [];

    function onListen(func) {
        listeners.push(func);
    }

    function onPush(path) {
        listeners.forEach(listener =>
            listener({
                pathname: path,
                search: "",
            })
        );
    }

    const serverHistory = createServerHistory("/foo", "", onPush, onListen);
    const router = new Router(serverHistory);
    let state = "";

    router.add({
        path: "/",
        name: "base",
        onChange: (from, to, next) => {
            state = "BASE_BEFORE_ON_CHANGE";
            return new Promise(resolve => setTimeout(resolve, 100)).then(() => {
                return next().then(() => {
                    state = "BASE_AFTER_ON_CHANGE";
                });
            });
        },
        children: [
            {
                path: "foo",
                name: "foo",
                onEnter: (to, next) => {
                    state = "FOO_BEFORE_ON_ENTER";
                    return new Promise(resolve => setTimeout(resolve, 100)).then(() => {
                        return next().then(() => {
                            state = "FOO_AFTER_ON_ENTER";
                        });
                    });
                },
                onChange: (from, to, next) => {
                    state = "FOO_BEFORE_ON_CHANGE";
                    return new Promise(resolve => setTimeout(resolve, 100)).then(() => {
                        return next().then(() => {
                            state = "FOO_AFTER_ON_CHANGE";
                        });
                    });
                },
            },
        ],
    });

    const onDone = ({ error }) => {
        if (error) {
            return done.fail(error);
        }

        expect(router.getMatchedRouteName()).toEqual("base.foo");
        expect(router.currentRouteName).toEqual("base.foo");
        expect(state).toEqual("FOO_AFTER_ON_ENTER");

        setTimeout(() => {
            router.subscribe(() => {
                if (router.getMatchedRouteName() === "base") {
                    try {
                        expect(state).toEqual("BASE_BEFORE_ON_CHANGE");
                        setTimeout(() => {
                            router.redirect("base.foo");
                        }, 2000);
                    } catch (err) {
                        done.fail(err);
                    }
                }

                if (router.getMatchedRouteName() === "base.foo") {
                    try {
                        expect(state).toEqual("FOO_BEFORE_ON_ENTER");
                        done();
                    } catch (err) {
                        done.fail(err);
                    }
                }
            });

            router.redirect("base");
        }, 1000);
    };

    router.start(onDone);
});
