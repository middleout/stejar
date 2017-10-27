const preset = require("./eslint.preset");
preset.extends.push("prettier/react");
preset.extends.push("plugin:react/recommended");
preset.plugins.push("react");
preset.rules["react/react-in-jsx-scope"] = "off";
preset.rules["react/prop-types"] = "off";

module.exports = preset;
