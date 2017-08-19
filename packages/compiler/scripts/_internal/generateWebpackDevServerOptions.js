module.exports = function generateWebpackDevServerOptions(webpackConfig) {
    return {
        contentBase: webpackConfig.output.path,
        publicPath: webpackConfig.output.publicPath,
        historyApiFallback: true,
        hot: true,
        quiet: false,
        noInfo: true,
        inline: true,
        stats: {
            colors: true,
        },
    };
};
