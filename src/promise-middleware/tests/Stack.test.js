import { Stack } from "./../src/Stack";

test("it can instantiate", () => {
    const stack = new Stack();
    expect(stack).toBeInstanceOf(Stack);
});
//
test("It can add a queue item", () => {
    const stack = new Stack();
    stack.add(() => null);

    expect(stack).toBeInstanceOf(Stack);
});
//
test("It can run a queue item", done => {
    let count = 0;
    const stack = new Stack();

    stack.add(() => {
        return new Promise(resolve => {
            setTimeout(() => {
                count++;
                resolve();
            }, 100);
        });
    });

    stack.run().then(() => {
        expect(count).toBe(1);
        done();
    });
});

test("It can run two queue items", done => {
    let count = 0;
    const stack = new Stack();

    stack.add(() => {
        return new Promise(resolve => {
            setTimeout(() => {
                count++;
                resolve();
            }, 100);
        });
    });

    stack.add(() => {
        return new Promise(resolve => {
            setTimeout(() => {
                count++;
                resolve();
            }, 100);
        });
    });

    stack.run().then(() => {
        expect(count).toEqual(2);
        done();
    });
});

test("It can run two queue items with opts", done => {
    let count = 0;
    const stack = new Stack();

    stack.add((data) => {
        return new Promise(resolve => {
            setTimeout(() => {
                count += data;
                resolve();
            }, 100);
        });
    });

    stack.add((data) => {
        return new Promise(resolve => {
            setTimeout(() => {
                count += data;
                resolve();
            }, 100);
        });
    });

    stack.run(5).then(() => {
        expect(count).toEqual(10);
        done();
    });
});