import { withRouter } from "./withRouter";

function onClick(router, to, params, query, event) {
    event.preventDefault();
    router.redirect(to, params, query);
}

function _Link({ routing, to, params, query, children, className = "" }) {
    return (
        <a
            onClick={onClick.bind(null, routing.router, to, params, query)}
            href={routing.router.generatePathFromName(to, params, query)}
            className={className}>
            {children}
        </a>
    );
}

export const Link = withRouter(_Link);
