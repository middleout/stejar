import RateLimit from "express-rate-limit";

export const rateLimitPlugin = (requestsPerSession, sessionLifetime, debug = false) => app => {
    app.enable("trust proxy");
    const limiter = new RateLimit({
        windowMs: sessionLifetime * 1000, // in miliseconds
        // delayAfter: 0, // begin slowing down responses after the first request
        delayMs: 0, // slow down subsequent responses by 3 seconds per request
        max: requestsPerSession, // limit each IP to 100 requests per windowMs,
        headers: debug,
    });
    app.use(limiter);
};
