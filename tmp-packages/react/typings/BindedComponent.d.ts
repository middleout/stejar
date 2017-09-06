import { Component as ReactComponent } from "react";
export declare abstract class BindedComponent<P = {}, S = {}> extends ReactComponent<P, S> {
    props: P & {
        children?: any;
    };
    /**
     * @param props
     * @param context
     */
    constructor(props: P, context?: any);
}
