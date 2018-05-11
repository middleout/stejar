import { Router } from "@stejar/router";
import { createBrowserHistory } from "history";

export function BrowserRouter(options) {
    return Router({
        history: createBrowserHistory(),
        ...options,
    });
}
