import { Stack } from "./Stack";

test("it can instantiate", () => {
    const stack = new Stack();
    expect(stack).toBeInstanceOf(Stack);
});

test("It can add a queue item", () => {
    const stack = new Stack();
    stack.add(() => null);

    expect(stack).toBeInstanceOf(Stack);
});

test("It can run a queue item", done => {
    let count = 0;
    const stack = new Stack();
    stack.add(() => Promise.resolve(count++));

    stack
        .run()
        .then(() => {
            expect(count).toBe(1);
            done();
        })
        .catch(err => done.fail(err));
});

test("It can run two queue items", done => {
    let count = 0;
    const stack = new Stack();
    stack.add(next => {
        count++;
        return next();
    });
    stack.add(next => {
        count++;
        return next();
    });

    stack
        .run()
        .then(() => {
            expect(count).toBe(2);
            done();
        })
        .catch(err => done.fail(err));
});

test("It can run two queue items with custom data", done => {
    const stack = new Stack();
    stack.add((state, next) => {
        expect(state).toBe("foo");
        return next();
    });
    stack.add((state, next) => {
        expect(state).toBe("foo");
        return next();
    });

    let state = "foo";
    stack
        .run(state)
        .then(() => {
            expect(state).toBe("foo");
            done();
        })
        .catch(err => done.fail(err));
});

test("It can run two queue items without running the second one if no next is called", done => {
    let p1WasCalled = false;
    let p2WasCalled = false;
    const stack = new Stack();
    stack.add(next => {
        return next().then(() => (p1WasCalled = true));
    });
    stack.add(() => {
        p2WasCalled = true;
        return Promise.resolve();
    });

    stack
        .run()
        .then(() => {
            expect(p2WasCalled).toBe(true);
            expect(p1WasCalled).toBe(false);
            done();
        })
        .catch(err => done.fail(err));
});

test("Custom code #1", done => {
    let items = {};

    const buildMiddleware = (index, runNext = true) => {
        items[index] = {
            started: false,
            finished: false,
        };

        return next => {
            if (index > 1) {
                expect(items[index - 1].started).toBe(true);
                expect(items[index - 1].finished).toBe(false);
            }

            return Promise.resolve()
                .then(() => (items[index].started = true))
                .then(() => new Promise(resolve => setTimeout(resolve, 100)))
                .then(
                    () =>
                        runNext
                            ? next()
                                  .then(() => new Promise(resolve => setTimeout(resolve, 100)))
                                  .then(() => {
                                      if (!items[index + 1]) {
                                          return;
                                      }
                                      expect(items[index + 1].started).toBe(true);
                                      expect(items[index + 1].finished).toBe(true);
                                  })
                                  .then(() => (items[index].finished = true))
                            : null
                );
        };
    };

    const stack = new Stack();

    const middleware1 = buildMiddleware(1);
    const middleware2 = buildMiddleware(2);
    const middleware3 = buildMiddleware(3);

    stack
        .add(middleware1)
        .add(middleware2)
        .add(middleware3);

    stack
        .run()
        .then(() => {
            done();
        })
        .catch(err => done.fail(err));
});

test("Custom code #1", done => {
    let items = {};

    const buildMiddleware = (index, runNext = true) => {
        items[index] = {
            started: false,
            finished: false,
        };

        return next => {
            return Promise.resolve()
                .then(() => (items[index].started = true))
                .then(() => new Promise(resolve => setTimeout(resolve, 100)))
                .then(
                    () =>
                        runNext
                            ? next()
                                  .then(() => new Promise(resolve => setTimeout(resolve, 100)))
                                  .then(() => (items[index].finished = true))
                            : null
                );
        };
    };

    const stack = new Stack();

    const middleware1 = buildMiddleware(1);
    const middleware2 = buildMiddleware(2, false);
    const middleware3 = buildMiddleware(3);

    stack
        .add(middleware1)
        .add(middleware2)
        .add(middleware3);

    stack
        .run()
        .then(() => {
            expect(items[1].started).toBe(true);
            expect(items[2].started).toBe(true);
            expect(items[3].started).toBe(false);
            expect(items[1].finished).toBe(false);
            expect(items[2].finished).toBe(false);
            expect(items[3].finished).toBe(false);
            done();
        })
        .catch(err => done.fail(err));
});
