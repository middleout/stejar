export const RouteMatch = ({ routes, params, query }) => {
    const name = routes
        .filter(route => route.name)
        .map(route => route.name)
        .join(".");

    return { name, routes, params, query, options: {} };
};
