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
        this.component = null;

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

        const component = this.buildComponentTree(this.router.getMatchedRoute());
        return component;
    }

    buildComponentTree(spec, child) {
        let component = child;

        if (spec.component) {
            if (!child) {
                component = createElement(spec.component, {});
            } else {
                component = createElement(spec.component, {}, child);
            }
        }
        if (spec.parent) {
            component = this.buildComponentTree(spec.parent, component);
        }

        return component;
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
