import { func, object, string, bool } from "prop-types";
import { withRouter } from "./withRouter";

LinkComponent.propTypes = {
    render: func.isRequired,
    query: object,
    params: object,
    to: string,
    reuseParams: bool,
    reuseQuery: bool,
    target: string,
};

export function LinkComponent({
    render,
    router,
    to = null,
    params = {},
    query = {},
    reuseParams,
    reuseQuery,
    target = undefined,
    ...props
}) {
    const options = {};
    if (typeof reuseParams !== "undefined") {
        options.reuseParams = reuseParams;
    }
    if (typeof reuseQuery !== "undefined") {
        options.reuseQuery = reuseQuery;
    }

    const onClick = (...args) => {
        let event = args.length > 1 ? args[args.length - 1] : args[0];
        event.preventDefault();
        router.redirect(to, params, query, options);

        if (props.onClick) {
            props.onClick(...args);
        }
    };
    const onTouchEnd = (...args) => {
        let event = args.length > 1 ? args[args.length - 1] : args[0];
        event.preventDefault();
        router.redirect(to, params, query, options);

        if (props.onClick) {
            props.onClick(...args);
        }
    };

    if (props.href) {
        throw new Error("Cannot have href on a Link element (since it is generated automatically");
    }

    const href = router.buildPath(to, params, query, options);

    return render({ ...props, onClick, onTouchEnd, href, target });
}

export const Link = withRouter(LinkComponent);
