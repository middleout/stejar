import { Router } from "@stejar/router";
import { createServerHistory } from "@stejar/router-server-history";

export class ServerRouter extends Router {
    constructor(options) {
        const url = options.url;
        const parts = url.split("?");
        const path = parts[0];
        const queryString = parts.length > 0 ? parts[1] : "";

        const onPush = (path, search = "", statusCode = 301) => {
            this.promiseResolve({
                isRedirect: true,
                code: statusCode,
                details: {
                    url: path + search,
                },
            });
        };

        options.history = createServerHistory(onPush, () => null, path, queryString);
        super(options);
    }

    start() {
        this.once(Router.MATCHED_EVENT, match => {
            this.promiseResolve({
                isRedirect: false,
                notFound: false,
                code: 200,
                details: match,
            });
        });

        this.once(Router.NOT_FOUND_EVENT, details => {
            this.promiseReject({
                notFound: true,
                code: 404,
                details,
            });
        });

        const promise = new Promise((resolve, reject) => {
            this.promiseResolve = resolve;
            this.promiseReject = reject;
        });
        super.start();

        return promise;
    }
}
