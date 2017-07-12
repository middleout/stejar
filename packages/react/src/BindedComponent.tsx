import { Component as ReactComponent } from "react";
import { binder } from "./binder";

export abstract class BindedComponent<P = {}, S = {}> extends ReactComponent<P, S> {
    props: P & { children?: any };

    /**
     * @param props
     * @param context
     */
    constructor(props: P, context?: any) {
        super(props, context);
        binder(this);
    }
}
