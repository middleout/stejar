var path                       = require('path'),
	webpack                    = require('webpack'),
	merge                      = require('webpack-merge'),
	fs                         = require('fs'),
	cleanWebpackPlugin         = require('clean-webpack-plugin'),
	WebpackBuildNotifierPlugin = require('webpack-build-notifier'),
	TARGET                     = process.env.npm_lifecycle_event,
	nodeExternals              = require('webpack-node-externals'),
	babelConfig                = JSON.stringify({
		presets : [
			[ 'babel-preset-es2015', { modules : false } ]
		],
		plugins : []
	});

var common = {

	cache : true,

	entry : [
		'index.ts',
	],

	target : 'web',

	output    : {
		path          : './dist',
		filename      : 'index.js',
		libraryTarget : "commonjs2",
		library       : "@stejar/redux",
	},
	externals : [ nodeExternals() ],

	resolve : {
		modules    : [
			path.resolve('./'),
			path.resolve('./node_modules'),
		],
		extensions : [ '', '.js', '.ts', '.tsx' ]
	},

	plugins : [
		new WebpackBuildNotifierPlugin(),
	],

	module : {
		preLoaders : [
			{
				test   : /\.js$/,
				loader : "source-map"
			},
		],
		loaders    : [
			{
				test    : /\.tsx?$/,
				loaders : [
					`babel?${babelConfig}`,
					'ts',
				],
				exclude : [
					/node_modules/
				]
			},
		]
	},

	debug : false,
	stats : {
		modules  : false,
		colors   : false,
		reasons  : false,
		children : false,
		chunks   : false
	},
};

if ( TARGET === "deploy" ) {
	module.exports = merge(common, {
		plugins : [
			new webpack.optimize.UglifyJsPlugin({
				sourceMap     : false,
				mangle        : false,
				'screw-ie8'   : true,
				'keep-fnames' : true,
				expression    : false,
				compress      : {
					dead_code    : true,
					warnings     : false,
					sequences    : true,
					properties   : true,
					conditionals : true,
					booleans     : true,
					comparisons  : true,
					loops        : true,
					unused       : true,
					if_return    : true,
					join_vars    : true,
					cascade      : true,
					drop_console : true
				}
			}),
			new webpack.DefinePlugin({
				'process.env' : {
					NODE_ENV : JSON.stringify('production'),
				}
			})
		]
	});
} else {
	module.exports = merge(common, {
		plugins : [
			new webpack.DefinePlugin({
				'process.env' : {
					NODE_ENV : JSON.stringify('development'),
				}
			})
		]
	});
}
