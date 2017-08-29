module.exports = require("babel-jest").createTransformer({
    presets: [["es2015"]],
    plugins: ["transform-runtime", "jsx-control-statements", "transform-react-jsx", "transform-decorators-legacy"],
});
