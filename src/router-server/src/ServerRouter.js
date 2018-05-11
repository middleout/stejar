import { Router, Events } from "@stejar/router";
import { createMemoryHistory } from "history";

export function ServerRouter({ url, ...options }) {
    const history = createMemoryHistory({
        initialEntries: [url],
        getUserConfirmation: () => null,
    });

    const router = Router({
        history,
        ...options,
    });

    const _start = router.start;
    router.start = () => {
        return new Promise(resolve => {
            let resolved = false;

            history.block(location => {
                resolve({
                    redirect: location.pathname,
                    notFound: false,
                    statusCode: location.state.statusCode || 301,
                    error: null,
                    match: null,
                });
                resolved = true;
            });

            router.once(Events.NOT_FOUND, details => {
                if (resolved) {
                    return;
                }

                resolve({
                    redirect: false,
                    notFound: true,
                    statusCode: 404,
                    error: details,
                    match: null,
                });
            });

            _start(match => {
                if (resolved) {
                    return;
                }

                resolve({
                    redirect: false,
                    notFound: false,
                    statusCode: 200,
                    error: null,
                    match: match,
                });
            });
        });
    };

    return router;
}
