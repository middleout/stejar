import cors from "cors";

export const corsPlugin = (opts = {}) => app => {
    const corsMiddleware = cors(opts);

    app.use(corsMiddleware);
    app.options("*", corsMiddleware); // Is this required?
};
