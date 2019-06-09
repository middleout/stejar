const path = require("path");
const fs = require("fs");
const camelCase = require("@stejar/utils/es/camelCase");
const mkDirByPathSync = require("@stejar/utils/es/mkDirByPathSync");

module.exports = {
    command: "make:module <name>",
    callback: name => {
        name = camelCase(name);

        const basePath = path.resolve(path.join("src", "modules", name));
        mkDirByPathSync(basePath);

        mkDirByPathSync(path.resolve(path.join(basePath, "redux", "actions")));
        mkDirByPathSync(path.resolve(path.join(basePath, "redux", "reducers")));
        mkDirByPathSync(path.resolve(path.join(basePath, "redux", "selectors")));
        mkDirByPathSync(path.resolve(path.join(basePath, "middlewares")));
        mkDirByPathSync(path.resolve(path.join(basePath, "components")));

        fs.writeFileSync(path.resolve(path.join(basePath, "redux", "actions", ".gitkeep")), "");
        fs.writeFileSync(path.resolve(path.join(basePath, "redux", "reducers", ".gitkeep")), "");
        fs.writeFileSync(path.resolve(path.join(basePath, "redux", "selectors", ".gitkeep")), "");
        fs.writeFileSync(path.resolve(path.join(basePath, "middlewares", ".gitkeep")), "");
        fs.writeFileSync(path.resolve(path.join(basePath, "components", ".gitkeep")), "");
    },
};
