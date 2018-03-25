import { createElement } from "react";
import { render } from "react-dom";
import "./index.scss";

render(createElement(() => <div>Hello World</div>), document.getElementById("app"));

const a = async () => {
    await Promise.resolve();
};

a().then(() => {
    console.warn("b");
});
