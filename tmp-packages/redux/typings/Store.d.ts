import { Reducer, Store as ReduxStorer, Unsubscribe } from "redux";
import { Action } from "./Action";
export declare class Store<S> {
    /**
     * @type {ReduxStorer<S>}
     */
    protected store: ReduxStorer<S>;
    /**
     * @constructor
     */
    constructor();
    /**
     * @param store
     */
    bootRedux(store: ReduxStorer<S>): void;
    /**
     * @param action
     * @param payload
     * @returns {A}
     */
    dispatch<P>(action: Action<P> | string | any, payload?: P): any;
    /**
     * @returns {S}
     */
    getState(): S;
    /**
     * @param listener
     * @returns {Unsubscribe}
     */
    subscribe(listener: () => void): Unsubscribe;
    /**
     * @param nextReducer
     */
    replaceReducer(nextReducer: Reducer<S>): void;
}
