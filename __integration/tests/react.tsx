import React, {Component, PureComponent} from "react";
// import { PureComponent, Component, DangerousHtml } from "@stejar/react";
import { DangerousHtml } from "@stejar/react";
import { render } from "react-dom";

export default function() {
    class PureApp extends PureComponent {
        render() {
            return <div><DangerousHtml>Pure Component {"<span>HELLO WORLD</span>"}</DangerousHtml></div>
        }
    }

    class App extends Component {
        render() {
            return <div>{this.runCeva()} <br/><PureApp/> </div>;
        }

        protected ceva = "CEVA";

        protected runCeva() {
            return this.ceva;
        }
    }

    render(<App />, document.getElementById("root2"));
}
