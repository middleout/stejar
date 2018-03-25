const express = require("express");
const app = express();
const args = process.argv.slice(2);
const host = args[0] || "localhost";
const port = args[1] || 3000;

app.use(express.static("./dist/client"));

app.listen(port, host, err => {
    if (err) {
        console.error(err);
        return false;
    }

    console.info("==> 🌎 Listening on port %s. Open up http://%s:%s/ in your browser.", port, host, port);
});
