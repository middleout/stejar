import { ServiceManager } from "@stejar/di";
import { combineStores, ReducerStore, Store } from "@stejar/redux";
import { combineReducers, createStore } from "redux";

export default function() {
    interface IState {
        FooStore?: IFooStoreState;
        BazStore?: IFooStoreState;
    }

    class FooAction {
        constructor(public payload: string) {}
    }

    interface IFooStoreState {
        foo: string;
    }

    class FooStore extends ReducerStore<IFooStoreState> {
        constructor() {
            super();
            this.bind(null, (): IFooStoreState => ({ foo: "" }));
            this.bind(FooAction.name, this.handleFoo);
        }

        protected handleFoo(previousState: IFooStoreState, action: FooAction): IFooStoreState {
            return {
                foo: action.payload + "baz",
            };
        }
    }

    const sm = new ServiceManager();

    const store = new Store<IState>();
    sm.set(Store, store);
    sm.bindToMethod("setStore", Store);

    function buildReducer() {
        return combineReducers<IState>({ ...combineStores(sm)(FooStore) });
    }

    const redux = createStore<IState>(buildReducer());
    store.bootRedux(redux);

    store.replaceReducer(buildReducer());

    const finalState = {
        FooStore: {
            foo: "barbaz",
        },
    };

    store.subscribe(() => {
        console.log(store.getState());
    });

    store.dispatch(new FooAction("bar"));
}
