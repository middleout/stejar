const path = require("path");
const fs = require("fs");
const capitalizeFirstLetter = require("@stejar/utils/es/capitalizeFirstLetter");
const camelCase = require("@stejar/utils/es/camelCase");
const mkDirByPathSync = require("@stejar/utils/es/mkDirByPathSync");

let tpl = `export async function _NAME_Middleware(routeMatch, options) {
    return import("./_NAME_Component").then(m => m._NAME_Component);
}`;

module.exports = {
    command: "make:middleware <name>",
    option: ["-m, --module <module>", "create the component in this module", "app"],
    callback: name => {
        name = camelCase(name).replace("Middleware", "");

        const basePath = path.resolve(path.join("src", "modules", module, "middlewares", name));
        mkDirByPathSync(basePath);

        name = capitalizeFirstLetter(name);

        tpl = tpl.replace(/_NAME_/g, name);
        fs.writeFileSync(path.join(basePath, `${name}Middleware.js`), tpl);
    },
};
