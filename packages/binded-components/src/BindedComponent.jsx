import { Component as ReactComponent } from "react";
import { binder } from "./binder";

export class BindedComponent extends ReactComponent {
    /**
     * @param props
     * @param context
     */
    constructor(props, context) {
        super(props, context);
        binder(this);
    }
}
