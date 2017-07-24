import { ServiceManager } from "@stejar/di";
import { AbstractActionsCreator } from "../src/AbstractActionsCreator";

test("Should be able to use it", () => {
    interface State {
        foo: string;
    }

    class Actions extends AbstractActionsCreator<State> {}

    const sm = new ServiceManager();

    class Store<S> {
        constructor(protected state: S) {}

        getState(): S {
            return this.state;
        }

        dispatch(args: any) {
            return args;
        }
    }
    const state = { foo: "bar" };
    sm.set(Store, new Store(state));
    sm.bindToMethod("setStore", Store);

    const actions = sm.get(Actions);

    expect(actions.getState()).toEqual(state);
    expect(actions.state).toEqual(state);
    expect(actions.dispatch("hello")).toEqual("hello");
});
