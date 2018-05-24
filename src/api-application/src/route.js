export function GET(name, path, handlerFactory) {
    return makeRoute({ name, path, handlerFactory, method: "GET" });
}
export function POST(name, path, handlerFactory) {
    return makeRoute({ name, path, handlerFactory, method: "POST" });
}
export function PUT(name, path, handlerFactory) {
    return makeRoute({ name, path, handlerFactory, method: "PUT" });
}
export function PATCH(name, path, handlerFactory) {
    return makeRoute({ name, path, handlerFactory, method: "PATCH" });
}
export function DELETE(name, path, handlerFactory) {
    return makeRoute({ name, path, handlerFactory, method: "DELETE" });
}
export function OPTIONS(name, path, handlerFactory) {
    return makeRoute({ name, path, handlerFactory, method: "OPTIONS" });
}

export function makeRoute({ method, path, handlerFactory }) {
    const handler = async (req, res) => {
        const handler = handlerFactory(req.$container);
        const response = await handler(req);

        req.$eventEmitter.emit("POST_REQUEST", {
            ...response,
            req,
            res,
        });
    };

    return app => app[method.toLowerCase()](path, handler);
}
