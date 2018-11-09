export function parseWebpackChunksToAssets(stats, usedChunkIds = []) {
    const js = [];
    const css = [];

    function parseAssets(assets) {
        assets.forEach(asset => {
            if (asset.endsWith(".js")) {
                js.push(stats.publicPath + asset);
            }

            if (asset.endsWith(".css")) {
                css.push(stats.publicPath + asset);
            }
        });
    }

    Object.keys(stats.entrypoints).forEach(entryPointName => {
        const assets = stats.entrypoints[entryPointName].assets;
        parseAssets(assets);
    });

    usedChunkIds.forEach(chunkName => {
        if (stats.assetsByChunkName[chunkName]) {
            const assets = stats.assetsByChunkName[chunkName];
            parseAssets(Array.isArray(assets) ? assets : [assets]);
        }
    });

    return {
        js: js.map(item => `<script src="${item}" defer></script>`).join("\n"),
        css: css.map(item => `<link media="all" rel="stylesheet" href="${item}" />`).join("\n"),
    };
}
