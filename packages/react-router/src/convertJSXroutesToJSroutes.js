import { IndexRedirectRoute } from "./IndexRedirectRoute";
import { RedirectRoute } from "./RedirectRoute";
import { IndexRoute } from "./IndexRoute";
import { NotFoundRoute } from "./NotFoundRoute";
import { NotFoundRedirectRoute } from "./NotFoundRedirectRoute";

export function convertJSXroutesToJSroutes(route) {
    const allowedProps = [
        "name",
        "path",
        "onEnter",
        "onChange",
        "component",
        "notFound",
        "index",
        "redirect",
        "toName",
        "toParams",
        "toQuery",
        "keepOldParams",
        "keepOldQuery",
    ];
    let jsRoute = {};

    allowedProps.forEach(prop => {
        if (route.props[prop]) {
            jsRoute[prop] = route.props[prop];
        }
    });

    if (route.type === IndexRedirectRoute) {
        jsRoute["index"] = true;
        jsRoute["redirect"] = true;
    }

    if (route.type === RedirectRoute) {
        jsRoute["redirect"] = true;
    }

    if (route.type === IndexRoute) {
        jsRoute["index"] = true;
    }

    if (route.type === NotFoundRoute) {
        jsRoute["notFound"] = true;
    }

    if (route.type === NotFoundRedirectRoute) {
        jsRoute["notFound"] = true;
        jsRoute["redirect"] = true;
    }

    if (route.props.children) {
        let children = route.props.children;
        if (!Array.isArray(children)) {
            if (route.props.children) {
                children = [route.props.children];
            } else {
                children = [];
            }
        }

        jsRoute.children = children.map(child => convertJSXroutesToJSroutes(child));
    }

    return jsRoute;
}
