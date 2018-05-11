import invariant from "invariant";
import queryString from "query-string";

export function buildPath(currentRoute, routes, to = null, params = {}, query = {}, options = {}) {
    if (!to) {
        invariant(
            currentRoute,
            `You cannot build a path to the "current" route if the current route was not set up. This usually means you are trying to build a path before the first router match`
        );
        to = currentRoute.name;
    }

    const defaults = {
        reuseParams: true,
        reuseQuery: false,
    };

    options = { ...defaults, ...options };

    params = reuseDataIfConditionIsMet(
        options.reuseParams && currentRoute,
        currentRoute ? currentRoute.params : {},
        params
    );
    query = reuseDataIfConditionIsMet(
        options.reuseQuery && currentRoute,
        currentRoute ? currentRoute.query : {},
        query
    );

    for (let route of routes) {
        const result = route.reverse(to, params, query);

        if (!result) {
            continue;
        }

        let queryAsString = "";
        if (Object.keys(query).length > 0) {
            queryAsString =
                "?" +
                queryString.stringify(query, {
                    arrayFormat: "bracket",
                });
        }

        return result + queryAsString;
    }

    // When going to root/FOO and FOO is not a valid locale
    //   and we redirect to root/FOO/tasks => and tasks uses FOO as locale
    //   then if the locale route will try to build the URL to tasks with FOO
    //   which will return NULL thus this will throw
    // OR a wrong "to" is given (to an inexistent name

    throw new Error(`Cannot build a path to the "${to}" route.`);
}

function reuseDataIfConditionIsMet(condition, data, current) {
    if (!condition) {
        return current;
    }

    return { ...data, ...current };
}
