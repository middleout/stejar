import { StdStateAdapter } from "../src";

test("it can be constructed", () => {
    const adapter = new StdStateAdapter();
    expect(adapter).toBeInstanceOf(StdStateAdapter);
});

test("it can check for current route", () => {
    const adapter = new StdStateAdapter();
    expect(adapter.hasCurrentRoute()).toEqual(false);
});

test("it can update current data", () => {
    const adapter = new StdStateAdapter();

    adapter.update("foo", { bar: "x" }, { baz: "y" });
    expect(adapter.hasCurrentRoute()).toEqual(true);
    expect(adapter.getCurrentRouteName()).toEqual("foo");
    expect(adapter.getCurrentParams()).toEqual({ bar: "x" });
    expect(adapter.getCurrentQuery()).toEqual({ baz: "y" });
});

test("it can update and use previous data", () => {
    const adapter = new StdStateAdapter();

    adapter.update("foo", { bar: "x" }, { baz: "y" });
    adapter.update("foo2", { bar: "x2" }, { baz: "y2" });
    expect(adapter.getCurrentRouteName()).toEqual("foo2");
    expect(adapter.getCurrentParams()).toEqual({ bar: "x2" });
    expect(adapter.getCurrentQuery()).toEqual({ baz: "y2" });

    expect(adapter.getPreviousRouteName()).toEqual("foo");
    expect(adapter.getPreviousParams()).toEqual({ bar: "x" });
    expect(adapter.getPreviousQuery()).toEqual({ baz: "y" });
});
