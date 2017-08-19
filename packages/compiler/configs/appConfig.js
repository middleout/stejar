const fs = require("fs");

const defaults = {
    publicPath: "/",
    entry: "./src/client.tsx",
    port: 3000,
    host: "localhost",
    secure: false,
};

module.exports = Object.assign(
    {},
    defaults,
    fs.existsSync("./config/local.json") ? JSON.parse(fs.readFileSync("./config/local.json")) : {}
);
