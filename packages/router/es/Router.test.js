import { shallow } from "enzyme";
import { Router } from "./Router";
import { convertJSXroutesToJSroutes } from "./convertJSXroutesToJSroutes";
import { RouterContainer } from "./RouterContainer";
import { IndexRoute } from "./IndexRoute";
import { IndexRedirectRoute } from "./IndexRedirectRoute";
import { Route } from "./Route";
import { RedirectRoute } from "./RedirectRoute";
import { Link } from "./Link";
import { createServerHistory } from "./serverHistory";
import createMemoryHistory from "history/createMemoryHistory";
import { withRouter } from "./withRouter";

test("Should be able to render a route", function (done) {
    var serverHistory = createServerHistory("/", "", function () {
        return null;
    });
    var router = new Router(serverHistory);
    router.add({
        path: "/",
        name: "base"
    });

    var onDone = function onDone() {
        expect(router.getMatchedRouteName()).toEqual("base");
        done();
    };

    router.start(onDone);
});

test("Should be able to set a generic option on the router", function (done) {
    var serverHistory = createServerHistory("/foo/bar", "", function () {
        return null;
    });
    var router = new Router(serverHistory);

    router.setOptions({
        foo: "bar"
    });

    expect(router.getOptions()["foo"]).toEqual("bar");
    done();
});

test("Should be able to render a route with children", function (done) {
    var serverHistory = createServerHistory("/foo/bar", "", function () {
        return null;
    });
    var router = new Router(serverHistory);
    router.add({
        path: "/",
        name: "base",
        children: [{
            path: "foo",
            name: "foo",
            children: [{
                path: "bar",
                name: "bar"
            }]
        }]
    });

    var onDone = function onDone() {
        expect(router.getMatchedRouteName()).toEqual("base.foo.bar");
        done();
    };

    router.start(onDone);
});

test("Should not be able to start 2 times", function (done) {
    var serverHistory = createServerHistory("/", "", function () {
        return null;
    });
    var router = new Router(serverHistory);

    var inc = 0;
    var onDone = function onDone() {
        return inc++;
    };

    router.start(onDone);
    router.start(onDone);

    // jest.useFakeTimers();

    setTimeout(function () {
        try {
            expect(inc).toEqual(1);
        } catch (err) {
            done.fail(err);
        }
        done();
    });
    // jest.runAllTimers();
});