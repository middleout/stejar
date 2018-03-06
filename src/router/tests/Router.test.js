import util from "util";
import { createServerHistory } from "@stejar/router-server-history/es/createServerHistory";
import { StdStateAdapter } from "@stejar/router-std-state-adapter/es/StdStateAdapter";
import { Router } from "../src";

function generateServerHistory(path, query) {
    let listeners = [];

    function onListen(func) {
        listeners.push(func);
    }

    function onPush(path, search = "") {
        listeners.forEach(listener => listener({ pathname: path, search: search }));
    }

    return createServerHistory(onPush, onListen, path, query);
}

function generateMap() {
    return {
        "en-GB": {
            tasks: "tasks",
            tasksDelete: "delete/:id",
            tasksEdit: "edit/:id",
        },
        "ro-RO": {
            tasks: "tascuri",
            tasksDelete: "sterge/:id",
            tasksEdit: "editeaza/:id",
        },
    };
}

function getMapByLocale(map, locale, part) {
    if (!map[locale]) {
        return null;
    }

    return map[locale][part];
}

function generateMiddleware(msg) {
    return (from, to) => {
        //console.log(msg, { from, to });
    };
}

function generateComponent(msg) {
    return () => msg;
}

const generateRoutes = map => [
    {
        name: "base",
        path: "/",
        component: generateComponent("base handler"),
        middleware: generateMiddleware("base middleware"),
        routes: [
            {
                name: "locale",
                path: ":locale",
                component: generateComponent("locale handler"),
                middleware: generateMiddleware("locale middleware"),
                routes: [
                    {
                        name: "tasks",
                        path: ({ locale }) => getMapByLocale(map, locale, "tasks"),
                        component: generateComponent("tasks handler"),
                        middleware: generateMiddleware("tasks middleware"),
                        routes: [
                            {
                                match: "exact",
                                component: generateComponent("tasks exact handler"),
                                middleware: generateMiddleware("tasks exact middleware"),
                                routes: [
                                    {
                                        name: "delete",
                                        path: ({ locale }) => getMapByLocale(map, locale, "tasksDelete"),
                                        component: generateComponent("delete task handler"),
                                        middleware: generateMiddleware("delete task middleware"),
                                    },
                                ],
                            },
                            {
                                name: "edit",
                                path: ({ locale }) => getMapByLocale(map, locale, "tasksEdit"),
                                component: generateComponent("edit task handler"),
                                middleware: generateMiddleware("edit task middleware"),
                            },
                        ],
                    },
                ],
            },
        ],
    },
];

test("Router to allow root match", done => {
    const history = generateServerHistory("/", "");
    const stateAdapter = new StdStateAdapter();
    const router = new Router({ routes: generateRoutes(generateMap()), history, stateAdapter });

    router.subscribe(Router.MATCHED_EVENT, match => {
        expect(match.getParams()).toEqual({});
        expect(match.getQuery()).toEqual({});
        expect(match.getRoutes()[0].getName()).toEqual("base");
        done();
    });

    router.subscribe(Router.NOT_FOUND_EVENT, details => {
        done.fail("Not found " + JSON.stringify(details));
    });

    router.start();
    // console.log(util.inspect(router, false, null));
});

test("Router to allow locale match", done => {
    const history = generateServerHistory("/en-GB", "");
    const stateAdapter = new StdStateAdapter();
    const router = new Router({ routes: generateRoutes(generateMap()), history, stateAdapter });

    router.subscribe(Router.MATCHED_EVENT, match => {
        expect(match.getParams()).toEqual({ locale: "en-GB" });
        expect(match.getQuery()).toEqual({});
        expect(match.getRoutes()[0].getName()).toEqual("base");
        expect(match.getRoutes()[1].getName()).toEqual("locale");
        done();
    });

    router.subscribe(Router.NOT_FOUND_EVENT, details => {
        done.fail("Not found " + JSON.stringify(details));
    });

    router.start();
    // console.log(util.inspect(router, false, null));
});

test("Router to allow direct access of tasks in locale 'en-GB'", done => {
    const history = generateServerHistory("/en-GB/tasks", "");
    const stateAdapter = new StdStateAdapter();
    const router = new Router({ routes: generateRoutes(generateMap()), history, stateAdapter });

    router.subscribe(Router.MATCHED_EVENT, match => {
        expect(match.getParams()).toEqual({ locale: "en-GB" });
        expect(match.getQuery()).toEqual({});
        expect(match.getRoutes()[0].getName()).toEqual("base");
        expect(match.getRoutes()[1].getName()).toEqual("locale");
        expect(match.getRoutes()[2].getName()).toEqual("tasks");
        expect(match.getRoutes()[3].getName()).toEqual(null);
        expect(match.getRoutes()[3].getMatchType()).toEqual("exact");
        done();
    });

    router.subscribe(Router.NOT_FOUND_EVENT, details => {
        done.fail("Not found " + JSON.stringify(details));
    });

    router.start();
    // console.log(util.inspect(router, false, null));
});

test("Router to allow direct access of tasks in locale 'ro-RO'", done => {
    const history = generateServerHistory("/ro-RO/tascuri", "");
    const stateAdapter = new StdStateAdapter();
    const router = new Router({ routes: generateRoutes(generateMap()), history, stateAdapter });

    router.subscribe(Router.MATCHED_EVENT, match => {
        expect(match.getParams()).toEqual({ locale: "ro-RO" });
        expect(match.getQuery()).toEqual({});
        expect(match.getRoutes()[0].getName()).toEqual("base");
        expect(match.getRoutes()[1].getName()).toEqual("locale");
        expect(match.getRoutes()[2].getName()).toEqual("tasks");
        expect(match.getRoutes()[3].getName()).toEqual(null);
        expect(match.getRoutes()[3].getMatchType()).toEqual("exact");
        done();
    });

    router.subscribe(Router.NOT_FOUND_EVENT, details => {
        done.fail("Not found " + JSON.stringify(details));
    });

    router.start();
    // console.log(util.inspect(router, false, null));
});

test("Router to allow direct access of tasks in an unknown locale", done => {
    const history = generateServerHistory("/unknown/tasks", "");
    const stateAdapter = new StdStateAdapter();
    const router = new Router({ routes: generateRoutes(generateMap()), history, stateAdapter });

    router.subscribe(Router.MATCHED_EVENT, () => {
        done.fail("Should not match");
    });

    router.subscribe(Router.NOT_FOUND_EVENT, () => {
        done();
    });

    router.start();
    // console.log(util.inspect(router, false, null));
});

test("Router to allow access of delete task - inside the exact match - in an locale 'en-GB'", done => {
    const history = generateServerHistory("/en-GB/tasks/delete/1", "");
    const stateAdapter = new StdStateAdapter();
    const router = new Router({ routes: generateRoutes(generateMap()), history, stateAdapter });

    router.subscribe(Router.MATCHED_EVENT, match => {
        expect(match.getParams()).toEqual({ locale: "en-GB", id: "1" });
        expect(match.getQuery()).toEqual({});
        expect(match.getRoutes()[0].getName()).toEqual("base");
        expect(match.getRoutes()[1].getName()).toEqual("locale");
        expect(match.getRoutes()[2].getName()).toEqual("tasks");
        expect(match.getRoutes()[3].getName()).toEqual(null);
        expect(match.getRoutes()[3].getMatchType()).toEqual("exact");
        expect(match.getRoutes()[4].getName()).toEqual("delete");
        done();
    });

    router.subscribe(Router.NOT_FOUND_EVENT, details => {
        done.fail("Not found " + JSON.stringify(details));
    });

    router.start();
    // console.log(util.inspect(router, false, null));
});

test("Router to allow access of delete task - inside the exact match - in an locale 'ro-RO'", done => {
    const history = generateServerHistory("/ro-RO/tascuri/sterge/1", "");
    const stateAdapter = new StdStateAdapter();
    const router = new Router({ routes: generateRoutes(generateMap()), history, stateAdapter });

    router.subscribe(Router.MATCHED_EVENT, match => {
        expect(match.getParams()).toEqual({ locale: "ro-RO", id: "1" });
        expect(match.getQuery()).toEqual({});
        expect(match.getRoutes()[0].getName()).toEqual("base");
        expect(match.getRoutes()[1].getName()).toEqual("locale");
        expect(match.getRoutes()[2].getName()).toEqual("tasks");
        expect(match.getRoutes()[3].getName()).toEqual(null);
        expect(match.getRoutes()[3].getMatchType()).toEqual("exact");
        expect(match.getRoutes()[4].getName()).toEqual("delete");
        done();
    });

    router.subscribe(Router.NOT_FOUND_EVENT, details => {
        done.fail("Not found " + JSON.stringify(details));
    });

    router.start();
    // console.log(util.inspect(router, false, null));
});

test("Router to allow access of delete task - inside the exact match - in an unknown locale", done => {
    const history = generateServerHistory("/unknown/tascuri/sterge/1", "");
    const stateAdapter = new StdStateAdapter();
    const router = new Router({ routes: generateRoutes(generateMap()), history, stateAdapter });

    router.subscribe(Router.MATCHED_EVENT, () => {
        done.fail("Should not match");
    });

    router.subscribe(Router.NOT_FOUND_EVENT, () => {
        done();
    });

    router.start();
    // console.log(util.inspect(router, false, null));
});

test("Router to allow access of edit task in locale 'en-GB'", done => {
    const history = generateServerHistory("/en-GB/tasks/edit/1", "");
    const stateAdapter = new StdStateAdapter();
    const router = new Router({ routes: generateRoutes(generateMap()), history, stateAdapter });

    router.subscribe(Router.MATCHED_EVENT, match => {
        expect(match.getParams()).toEqual({ locale: "en-GB", id: "1" });
        expect(match.getQuery()).toEqual({});
        expect(match.getRoutes()[0].getName()).toEqual("base");
        expect(match.getRoutes()[1].getName()).toEqual("locale");
        expect(match.getRoutes()[2].getName()).toEqual("tasks");
        expect(match.getRoutes()[3].getName()).toEqual("edit");
        done();
    });

    router.subscribe(Router.NOT_FOUND_EVENT, details => {
        done.fail("Not found " + JSON.stringify(details));
    });

    router.start();
    // console.log(util.inspect(router, false, null));
});

test("Router to allow access of edit task in locale 'ro-RO'", done => {
    const history = generateServerHistory("/ro-RO/tascuri/editeaza/1", "");
    const stateAdapter = new StdStateAdapter();
    const router = new Router({ routes: generateRoutes(generateMap()), history, stateAdapter });

    router.subscribe(Router.MATCHED_EVENT, match => {
        expect(match.getParams()).toEqual({ locale: "ro-RO", id: "1" });
        expect(match.getQuery()).toEqual({});
        expect(match.getRoutes()[0].getName()).toEqual("base");
        expect(match.getRoutes()[1].getName()).toEqual("locale");
        expect(match.getRoutes()[2].getName()).toEqual("tasks");
        expect(match.getRoutes()[3].getName()).toEqual("edit");
        done();
    });

    router.subscribe(Router.NOT_FOUND_EVENT, details => {
        done.fail("Not found " + JSON.stringify(details));
    });

    router.start();
    // console.log(util.inspect(router, false, null));
});

test("Router to allow access of edit task in an unknown locale", done => {
    const history = generateServerHistory("/unknown/tascuri/editeaza/1", "");
    const stateAdapter = new StdStateAdapter();
    const router = new Router({ routes: generateRoutes(generateMap()), history, stateAdapter });

    router.subscribe(Router.MATCHED_EVENT, () => {
        done.fail();
    });

    router.subscribe(Router.NOT_FOUND_EVENT, () => {
        done();
    });

    router.start();
    // console.log(util.inspect(router, false, null));
});

test("Router can navigate from route to another", done => {
    const history = generateServerHistory("/ro-RO/tascuri", "");
    const stateAdapter = new StdStateAdapter();
    const router = new Router({ routes: generateRoutes(generateMap()), history, stateAdapter });

    let stateMachine = 0;

    router.subscribe(Router.MATCHED_EVENT, routeMatch => {
        if (stateMachine == 0) {
            expect(routeMatch.getName()).toEqual("base.locale.tasks");
            expect(routeMatch.getParams()).toEqual({
                locale: "ro-RO",
            });
            stateMachine++;
            router.navigate("base.locale.tasks.edit", { id: 5 });
            return;
        }

        if (stateMachine == 1) {
            expect(routeMatch.getName()).toEqual("base.locale.tasks.edit");
            expect(routeMatch.getParams()).toEqual({
                locale: "ro-RO",
                id: "5",
            });
            stateMachine++;
            done();
            return;
        }

        done.fail("Should not get here");
    });

    router.start();
});
