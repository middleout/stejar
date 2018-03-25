import { injectable } from "../src/injectable";
import { inject } from "../src";
import { ServiceManager } from "../src/ServiceManager";
import { AbstractProvider } from "../src/AbstractProvider";

test("Should be able to instantiate", () => {
    const sm = new ServiceManager();
    expect(sm).toBeInstanceOf(ServiceManager);
});

test("Should be able to instantiate a new object", () => {
    const sm = new ServiceManager();

    @injectable
    class Tester {}

    expect(sm.get(Tester)).toBeInstanceOf(Tester);
});

test("Should be able to instantiate a new object with a fixed determined dependency", () => {
    const sm = new ServiceManager();

    @injectable
    class Tester {
        constructor(a) {
            this.a = a;
        }
    }

    sm.set(Tester, new Tester("Hello World"));

    expect(sm.get(Tester)).toBeInstanceOf(Tester);
    expect(sm.get(Tester).a).toEqual("Hello World");
});

// @deprecated
// test("Should be able to instantiate a new object with Pimple like solution", () => {
//     const sm = new ServiceManager();
//
//     @injectable
//     class Tester {
//         constructor(a) {
//             this.a = a;
//         }
//     }
//
//     sm.set(Tester, new Tester("Hello World"));
//
//     expect(sm.get(Tester)).toBeInstanceOf(Tester);
//     expect(sm.get(Tester).a).toEqual("Hello World");
// });

test("Should be able to instantiate a new object with a variable dependency", () => {
    const sm = new ServiceManager();

    @injectable
    class Child {}

    @inject(Child)
    class Parent {
        constructor(child) {
            this.child = child;
        }
    }

    expect(sm.get(Parent)).toBeInstanceOf(Parent);
    expect(sm.get(Parent).child).toBeInstanceOf(Child);
});

test("Service manager: Bind : String to String", () => {
    const sm = new ServiceManager();
    sm.set("foo", "ABC");
    expect(sm.get("foo")).toEqual("ABC");
});

test("Service manager: Bind : String to Instance", () => {
    const sm = new ServiceManager();

    class Bar {}

    const bar1 = new Bar();

    sm.set("bar", bar1);

    expect(sm.get("bar")).toBeInstanceOf(Bar);
    expect(sm.get("bar")).toBe(bar1);
});

test("Service manager: Bind : Class to Instance", () => {
    const sm = new ServiceManager();

    class Bar {}

    const bar1 = new Bar();
    const bar2 = new Bar();

    sm.set("bar", bar1);
    sm.set(Bar, bar2);

    expect(sm.get("bar")).toBeInstanceOf(Bar);
    expect(sm.get("bar")).toBe(bar1);
    expect(sm.get(Bar)).toBe(bar2);
    expect(sm.get("bar")).not.toBe(bar2);
});

test("Service manager: Alias #1", () => {
    const sm = new ServiceManager();

    sm.set("foo", "baz");
    sm.alias("bar", "foo");

    expect(sm.get("bar")).toBe("baz");
});

test("Service manager: Alias #2", () => {
    const sm = new ServiceManager();

    class Foo {}

    sm.set(Foo, "baz");
    sm.alias("bar", Foo);

    expect(sm.get("bar")).toBe("baz");
});

test("Service manager: Alias #3", () => {
    const sm = new ServiceManager();

    class Foo {}
    const foo = new Foo();

    sm.set(Foo, foo);
    sm.alias("bar", Foo);

    expect(sm.get("bar")).toBe(foo);
});

test("Service manager: Alias #4", () => {
    const sm = new ServiceManager();

    class Foo {}
    class Bar {}

    const foo = new Foo();

    sm.set(Foo, foo);
    sm.alias(Bar, Foo);

    expect(sm.get(Bar)).toBe(foo);
});

test("Service manager: Alias #4", () => {
    const sm = new ServiceManager();

    class Bar {}

    sm.set("foo", "bar");
    sm.alias(Bar, "foo");

    expect(sm.get(Bar)).toBe("bar");
});

test("Service manager: BindToMethod #1", () => {
    const sm = new ServiceManager();

    sm.set("bar", "baz");
    sm.bindToMethod("setBar", "bar");

    @injectable
    class Foo {
        constructor() {
            this.bar = "";
        }

        setBar(bar) {
            this.bar = bar;
            return this;
        }

        getBar() {
            return this.bar;
        }
    }

    expect(sm.get(Foo)).toBeInstanceOf(Foo);
    expect(sm.get(Foo).getBar()).toBe("baz");
});

test("Service manager: Provide #1", () => {
    const sm = new ServiceManager();

    class Foo {}

    sm.provide(Foo, () => {
        return "bar";
    });

    expect(sm.has(Foo)).toEqual(true);
    expect(sm.get(Foo)).toBe("bar");
});

test("Service manager: Provide #2", () => {
    const sm = new ServiceManager();

    class Foo {}

    sm.provide(Foo, () => {
        return undefined;
    });

    expect(() => sm.get(Foo)).toThrowError(
        `The provider for the class "${Foo.toString()}" must provide *something*. Got "undefined" instead.`
    );
});

test("Service manager: Provider", () => {
    const sm = new ServiceManager();

    class Bar {
        foo() {
            return "Baz";
        }
    }

    class FooProvider extends AbstractProvider {
        provides() {
            return "IFoo";
        }

        provide() {
            return new Bar();
        }
    }

    sm.provider(FooProvider);

    expect(sm.get("IFoo")).toBeInstanceOf(Bar);
    expect(sm.get("IFoo").foo()).toBe("Baz");
});

test("Service manager: Get", () => {
    const sm = new ServiceManager();

    expect(() => sm.get("Test")).toThrowError(`Cannot get "Test". There is no alias for this "string".`);
});

test("Service manager: Instantiate : Error", () => {
    const sm = new ServiceManager();

    class Foo {}

    const foo1 = sm.instantiate(Foo);
    const foo2 = sm.instantiate(Foo);

    expect(foo1).toBeInstanceOf(Foo);
    expect(foo2).toBeInstanceOf(Foo);
    expect(foo1).not.toBe(foo2);
});
