import { Router } from "@stejar/router";
import { createBrowserHistory } from "history";

export class BrowserRouter extends Router {
    constructor(options) {
        options.history = createBrowserHistory();
        super(options);
    }
}
