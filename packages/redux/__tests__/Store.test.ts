import { ServiceManager } from "@stejar/di";
import { combineReducers, createStore } from "redux";
import { combineStores } from "../src/combineStores";
import { ReducerStore } from "../src/ReducerStore";
import { Store } from "../src/Store";

interface State {
    FooStore?: FooStoreState;
    BazStore?: FooStoreState;
}

class FooAction {
    constructor(public payload: string) {}
}

interface FooStoreState {
    foo: string;
}

class FooStore extends ReducerStore<FooStoreState> {
    constructor() {
        super();
        this.bind(null, (): FooStoreState => ({ foo: "" }));
        this.bind(FooAction.name, this.handleFoo);
    }

    protected handleFoo(previousState: FooStoreState, action: FooAction): FooStoreState {
        return {
            foo: action.payload + "baz",
        };
    }
}

test("Should be able to use it", async () => {
    const sm = new ServiceManager();

    const store = new Store<State>();
    sm.set(Store, store);
    sm.bindToMethod("setStore", Store);

    function buildReducer() {
        return combineReducers<State>({ ...combineStores(sm)(FooStore) });
    }

    const redux = createStore<State>(buildReducer());
    store.bootRedux(redux);

    store.replaceReducer(buildReducer());

    const finalState = {
        FooStore: {
            foo: "barbaz",
        },
    };

    const promise = new Promise(resolve => {
        store.subscribe(() => {
            expect(store.getState()).toEqual(finalState);
            resolve();
        });
    });

    store.dispatch(new FooAction("bar"));

    await promise;

    expect(store.getState()).toEqual(finalState);

    const foo = sm.get(FooStore);
    expect(foo.getState()).toEqual(finalState);
});

test("Should be able to use it with custom store names", async () => {
    const sm = new ServiceManager();

    const store = new Store<State>();
    sm.set(Store, store);
    sm.bindToMethod("setStore", Store);

    function buildReducer() {
        return combineReducers<State>({ ...combineStores(sm)({
            BazStore: FooStore
        }) });
    }

    const redux = createStore<State>(buildReducer());
    store.bootRedux(redux);

    store.replaceReducer(buildReducer());

    const finalState = {
        BazStore: {
            foo: "barbaz",
        },
    };

    const promise = new Promise(resolve => {
        store.subscribe(() => {
            expect(store.getState()).toEqual(finalState);
            resolve();
        });
    });

    store.dispatch(new FooAction("bar"));

    await promise;

    expect(store.getState()).toEqual(finalState);

    const foo = sm.get(FooStore);
    expect(foo.getState()).toEqual(finalState);
});
