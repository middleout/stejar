const { set } = require("dot-prop");
const { resolve, parse } = require("path");
const walkSync = require("./walkSync");

module.exports = function loadConfig({ path = "config" } = {}) {
    const data = {};
    walkSync(path).map(path => {
        const { name, dir } = parse(path);
        set(
            data,
            dir
                .split("/")
                .concat(name)
                .join("."),
            require(resolve(path))
        );
    });

    /**
     * @property app
     */
    const config = data[path];

    Object.keys(config).forEach(name => {
        Object.keys(config[name]).forEach(key => {
            switch (config[name][key]) {
                case "true":
                    config[name][key] = true;
                    break;
                case "false":
                    config[name][key] = false;
                    break;
                default:
                    if (!isNaN(config[name][key])) {
                        config[name][key] = parseInt(config[name][key]);
                    }
                    break;
            }
        });
    });

    return config;
};
