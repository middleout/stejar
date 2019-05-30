import React from "react";
import { Router } from "@stejar/router";
import { RouterProvider } from "./RouterProvider";
import { createMemoryHistory } from "history";

export const storyRouter = ({ routes }) => {
    let component = () => null;
    const history = createMemoryHistory({
        initialEntries: [Object.keys(routes)[0]],
    });

    const router = Router({
        history,
        routes: Object.keys(routes).map(routeName => ({
            name: routeName,
            path: routes[routeName],
            component: () => component(),
        })),
    });

    return storyFn => {
        component = () => storyFn();
        history.push("");
        return <RouterProvider router={router} />;
    };
};
