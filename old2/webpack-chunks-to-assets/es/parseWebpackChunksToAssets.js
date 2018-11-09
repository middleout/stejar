"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseWebpackChunksToAssets = parseWebpackChunksToAssets;

function parseWebpackChunksToAssets(stats) {
  var usedChunkIds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var js = [];
  var css = [];

  function parseAssets(assets) {
    assets.forEach(function (asset) {
      if (asset.endsWith(".js")) {
        js.push(stats.publicPath + asset);
      }

      if (asset.endsWith(".css")) {
        css.push(stats.publicPath + asset);
      }
    });
  }

  Object.keys(stats.entrypoints).forEach(function (entryPointName) {
    var assets = stats.entrypoints[entryPointName].assets;
    parseAssets(assets);
  });
  usedChunkIds.forEach(function (chunkName) {
    if (stats.assetsByChunkName[chunkName]) {
      var assets = stats.assetsByChunkName[chunkName];
      parseAssets(Array.isArray(assets) ? assets : [assets]);
    }
  });
  return {
    js: js.map(function (item) {
      return "<script src=\"".concat(item, "\" defer></script>");
    }).join("\n"),
    css: css.map(function (item) {
      return "<link media=\"all\" rel=\"stylesheet\" href=\"".concat(item, "\" />");
    }).join("\n")
  };
}