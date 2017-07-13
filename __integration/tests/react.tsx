import React from "react";
import { DangerousHtml, BindedComponent,PureBindedComponent } from "@stejar/react";
import { render } from "react-dom";

export default function() {
    class PureApp extends PureBindedComponent {
        render() {
            return <div><DangerousHtml>Pure Component {"<span>HELLO WORLD</span>"}</DangerousHtml></div>
        }
    }

    class App extends BindedComponent {
        render() {
            return <div>{this.runCeva()} <br/><PureApp/> </div>;
        }

        protected ceva = "CEVA";

        protected runCeva() {
            return this.ceva;
        }
    }

    render(<App />, document.getElementById("root1"));
}
