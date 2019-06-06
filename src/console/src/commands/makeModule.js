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

        mkDirByPathSync(path.resolve(path.join(basePath, "actions")));
        mkDirByPathSync(path.resolve(path.join(basePath, "reducers")));
        mkDirByPathSync(path.resolve(path.join(basePath, "middlewares")));
        mkDirByPathSync(path.resolve(path.join(basePath, "components")));
        mkDirByPathSync(path.resolve(path.join(basePath, "selectors")));

        fs.writeFileSync(path.resolve(path.join(basePath, "actions", ".gitkeep")), "");
        fs.writeFileSync(path.resolve(path.join(basePath, "reducers", ".gitkeep")), "");
        fs.writeFileSync(path.resolve(path.join(basePath, "middlewares", ".gitkeep")), "");
        fs.writeFileSync(path.resolve(path.join(basePath, "components", ".gitkeep")), "");
        fs.writeFileSync(path.resolve(path.join(basePath, "selectors", ".gitkeep")), "");
    },
};
