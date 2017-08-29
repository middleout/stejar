import createWebpackCompiler from "./webpack/compiler";

/**
 * This is the main file that handles the DEVELOPMENT server.
 *
 * Start the webpack compiler. It will send us the assets list.
 * Once the compiler compiles, (re)start the express server.
 *
 * The express server will serve all static asssets from dist/client
 * and will render the HTML from the dist/server/index.js
 */
const compiler = createWebpackCompiler("build", assetsMap => {
    console.log("Built application for production !");
});

compiler.run();
