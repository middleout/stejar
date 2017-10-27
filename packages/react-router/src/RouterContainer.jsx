import { Component, createElement } from "react";
import { object } from "prop-types";
import invariant from "invariant";
import { convertJSXroutesToJSroutes } from "./convertJSXroutesToJSroutes";

export class RouterContainer extends Component {
    static childContextTypes = {
        router: object,
    };

    constructor(props) {
        super(props);
        invariant(props.router, "RouterContainer requires a `router`. ");

        this.router = props.router;
        this.unsubscribe = () => null;
        this.stop = () => null;
        this.components = [];

        const { children } = this.props;

        if (children) {
            if (Array.isArray(children)) {
                children.forEach(route => {
                    this.router.add(convertJSXroutesToJSroutes(route));
                });
            } else {
                this.router.add(convertJSXroutesToJSroutes(children));
            }
        }
    }

    getChildContext() {
        return {
            router: this.router,
        };
    }

    render() {
        if (!this.router.getMatchedRoute()) {
            return null;
        }

        this.buildComponentTree(this.router.getMatchedRoute());
        return this.listToNested(this.components);
    }

    buildComponentTree(spec) {
        if (spec.component) {
            this.components.push(spec.component);
        }

        if (spec.parent) {
            this.buildComponentTree(spec.parent);
        }
    }

    listToNested(list) {
        let firstTime = true;
        const X = list.reduce((Accumulator, Current) => {
            if (firstTime) {
                firstTime = false;
                Accumulator = createElement(Accumulator);
            }
            return createElement(Current, {}, Accumulator);
        });

        return X;
    }

    componentWillMount() {
        this.router.start(() => null);
    }

    componentDidMount() {
        this.unsubscribe = this.router.subscribe(() => {
            this.components = [];
            this.forceUpdate();
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }
}
