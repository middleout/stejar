import trim from "lodash.trim";
import path from "path";
import {config} from "dotenv";

config({path: path.resolve("./.env")});

export default {
    publicPath: trim(process.env.JS_CSS_PUBLIC_PATH || "/", "/") + "/" || "/",
    assetsPublicPath: process.env.ASSETS_PUBLIC_PATH ? trim(process.env.ASSETS_PUBLIC_PATH, "/") + "/" : null,
    startScriptPath: process.env.START_SCRIPT ? process.env.START_SCRIPT : null,
    distDirName: process.env.DIST_DIR_NAME ? process.env.DIST_DIR_NAME : null,
    clientDistDirName: process.env.CLIENT_DIST_DIR_NAME ? process.env.CLIENT_DIST_DIR_NAME : null,
    serverDistDirName: process.env.SERVER_DIST_DIR_NAME ? process.env.SERVER_DIST_DIR_NAME : null,
    browserEntryFile: process.env.BROWSER_ENTRY_FILE ? process.env.BROWSER_ENTRY_FILE : null,
    serverEntryFile: process.env.SERVER_ENTRY_FILE ? process.env.SERVER_ENTRY_FILE : null,
    assetsMapFileName: process.env.ASSETS_MAP_FILE_NAME ? process.env.ASSETS_MAP_FILE_NAME : null,
    faviconPath: process.env.FAVICON_PATH ? process.env.FAVICON_PATH : null,
};
