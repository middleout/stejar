import trim from "lodash.trim";

export default {
    publicPath: trim(process.env.JS_CSS_PUBLIC_PATH || "/", "/") + "/" || "/",
    assetsPublicPath: process.env.ASSETS_PUBLIC_PATH ? trim(process.env.ASSETS_PUBLIC_PATH, "/") + "/" : null,
};
