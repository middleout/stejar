import { ServiceManager, inject } from "@stejar/di";
import { createServerHistory } from "@stejar/router-server-history";
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

const generateRoutes = map => [
    {
        name: "base",
        path: "/",
        routes: [
            {
                name: "locale",
                path: ":locale",
                routes: [
                    {
                        name: "tasks",
                        path: ({ locale }) => getMapByLocale(map, locale, "tasks"),
                        routes: [
                            {
                                match: "exact",
                                routes: [
                                    {
                                        name: "delete",
                                        path: ({ locale }) => getMapByLocale(map, locale, "tasksDelete"),
                                    },
                                ],
                            },
                            {
                                name: "edit",
                                path: ({ locale }) => getMapByLocale(map, locale, "tasksEdit"),
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
    const router = new Router({ routes: generateRoutes(generateMap()), history });

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
});

test("Router to allow locale match", done => {
    const history = generateServerHistory("/en-GB", "");
    const router = new Router({ routes: generateRoutes(generateMap()), history });

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
    const router = new Router({ routes: generateRoutes(generateMap()), history });

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
    const router = new Router({ routes: generateRoutes(generateMap()), history });

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
    const router = new Router({ routes: generateRoutes(generateMap()), history });

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
    const router = new Router({ routes: generateRoutes(generateMap()), history });

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
    const router = new Router({ routes: generateRoutes(generateMap()), history });

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
    const router = new Router({ routes: generateRoutes(generateMap()), history });

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
    const router = new Router({ routes: generateRoutes(generateMap()), history });

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
    const router = new Router({ routes: generateRoutes(generateMap()), history });

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
    const router = new Router({ routes: generateRoutes(generateMap()), history });

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
    const router = new Router({ routes: generateRoutes(generateMap()), history });

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

test("Router can have routes with SM based paths", done => {
    class Foo {}

    @inject(Foo)
    class TasksRoutePathGenerator {
        constructor(foo) {
            this.foo = foo;
        }

        generate(params, query) {
            return "tasks";
        }
    }

    const sm = new ServiceManager();
    const history = generateServerHistory("/en-GB/tasks", "");
    const router = new Router({ history, serviceManager: sm });
    router.add({
        name: "base",
        path: "/",
        routes: [
            {
                name: "locale",
                path: ":locale",
                routes: [
                    {
                        name: "tasks",
                        path: TasksRoutePathGenerator,
                    },
                ],
            },
        ],
    });

    router.subscribe(Router.MATCHED_EVENT, routeMatch => {
        expect(routeMatch.getName()).toEqual("base.locale.tasks");
        expect(routeMatch.getParams()).toEqual({
            locale: "en-GB",
        });
        done();
    });

    router.subscribe(Router.NOT_FOUND_EVENT, () => {
        done.fail("404");
    });

    router.start();
});

test("Router can have routes with SM based paths as fn", done => {
    class State {
        value = 0;
        inc() {
            this.value++;
        }
    }

    function path(state) {
        return function path(from, to) {
            state.inc();
            return "tasks";
        };
    }

    function pathProvider(sm) {
        return path(sm.get(State));
    }

    const sm = new ServiceManager();
    const state = new State();
    sm.set(State, state);
    sm.provide(pathProvider, sm => pathProvider(sm));
    sm.provide(path, pathProvider);

    const history = generateServerHistory("/en-GB/tasks", "");
    const router = new Router({ history, serviceManager: sm });
    router.add({
        name: "base",
        path: "/",
        routes: [
            {
                name: "locale",
                path: ":locale",
                routes: [
                    {
                        name: "tasks",
                        path: path,
                    },
                ],
            },
        ],
    });

    router.subscribe(Router.MATCHED_EVENT, routeMatch => {
        expect(state.value).toEqual(1);
        expect(routeMatch.getName()).toEqual("base.locale.tasks");
        expect(routeMatch.getParams()).toEqual({
            locale: "en-GB",
        });
        done();
    });

    router.subscribe(Router.NOT_FOUND_EVENT, details => {
        console.warn(details);
        done.fail("404");
    });

    router.start();
});

// test("Router can have routes with SM based middlewares", done => {
//     let state = 0;
//
//     class Foo {}
//
//     @inject(Foo)
//     class TasksMiddleware {
//         constructor(foo) {
//             this.foo = foo;
//         }
//
//         invoke(from, to) {
//             state += 1;
//             return Promise.resolve();
//         }
//     }
//
//     const sm = new ServiceManager();
//     const history = generateServerHistory("/en-GB/tasks", "");
//     const router = new Router({ history, serviceManager: sm });
//     router.add({
//         name: "base",
//         path: "/",
//         routes: [
//             {
//                 name: "locale",
//                 path: ":locale",
//                 routes: [
//                     {
//                         name: "tasks",
//                         path: "tasks",
//                         middleware: TasksMiddleware,
//                     },
//                 ],
//             },
//         ],
//     });
//
//     router.subscribe(Router.MATCHED_EVENT, routeMatch => {
//         expect(state).toEqual(1);
//         expect(routeMatch.getName()).toEqual("base.locale.tasks");
//         expect(routeMatch.getParams()).toEqual({
//             locale: "en-GB",
//         });
//         done();
//     });
//
//     router.subscribe(Router.NOT_FOUND_EVENT, () => {
//         done.fail("404");
//     });
//
//     router.start();
// });

// test("Router can have routes with SM based middlewares as fn", done => {
//     class State {
//         value = 0;
//         inc() {
//             this.value++;
//         }
//     }
//
//     function middleware(state) {
//         return function middleware(from, to) {
//             state.inc();
//             return Promise.resolve();
//         };
//     }
//
//     function middlewareGeneratorProvider(sm) {
//         return middleware(sm.get(State));
//     }
//
//     const sm = new ServiceManager();
//     const state = new State();
//     sm.set(State, state);
//     sm.provide(middleware, middlewareGeneratorProvider);
//
//     const history = generateServerHistory("/en-GB/tasks", "");
//     const router = new Router({ history, serviceManager: sm });
//     router.add({
//         name: "base",
//         path: "/",
//         routes: [
//             {
//                 name: "locale",
//                 path: ":locale",
//                 routes: [
//                     {
//                         name: "tasks",
//                         path: "tasks",
//                         middleware: middleware,
//                     },
//                 ],
//             },
//         ],
//     });
//
//     router.subscribe(Router.MATCHED_EVENT, routeMatch => {
//         expect(state.value).toEqual(1);
//         expect(routeMatch.getName()).toEqual("base.locale.tasks");
//         expect(routeMatch.getParams()).toEqual({
//             locale: "en-GB",
//         });
//         done();
//     });
//
//     router.subscribe(Router.NOT_FOUND_EVENT, () => {
//         done.fail("404");
//     });
//
//     router.start();
// });
