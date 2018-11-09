import { Component } from "react";
import { binder } from "./binder";

export class BindedComponent extends Component {
    /**
     * @param props
     * @param context
     */
    constructor(props, context) {
        super(props, context);
        binder(this);
    }
}
