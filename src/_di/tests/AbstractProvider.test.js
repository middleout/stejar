import { AbstractProvider } from "../src/AbstractProvider";

test("Should not be able to run provides() method", () => {
    const instance = new AbstractProvider();
    expect(() => instance.provides()).toThrowError(`Abstract method provides() should not be called directly`);
});

test("Should not be able to run provide() method", () => {
    const instance = new AbstractProvider();
    expect(() => instance.provide(null)).toThrowError(
        `Abstract method provide(serviceManager) should not be called directly`
    );
});
