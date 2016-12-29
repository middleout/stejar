const path    = require('path');
const webpack = require('webpack');

module.exports = function (config) {
	config.set({
		browsers          : [ 'PhantomJS' ],
		singleRun         : true,
		files             : [
			'../node_modules/react/dist/react.min.js',
			'../node_modules/phantomjs-polyfill-find/find-polyfill.js',
			'../tests/**/*.spec.ts',
			'../tests/**/*.spec.tsx',
		],
		frameworks        : [
			'jasmine',
		],
		reporters         : [ 'progress', 'coverage' ],
		preprocessors     : {
			'../tests/**/*.spec.ts'  : [ 'webpack', 'sourcemap' ],
			'../tests/**/*.spec.tsx' : [ 'webpack', 'sourcemap' ],
			'../src/**/*'            : [ 'coverage' ],
		},
		coverageReporter  : {
			type : 'html',
			dir  : '../coverage/'
		},
		webpack           : {
			cache     : true,
			devtool   : 'inline-source-map',
			resolve   : {
				root       : [
					path.resolve('./'),
					path.resolve(__dirname, 'node_modules')
				],
				extensions : [ '', '.js', '.ts', '.tsx' ],
				alias      : {
					'cheerio' : 'cheerio/lib/cheerio'
				}
			},
			externals : {
				'jsdom'                          : true,
				'react/addons'                   : true,
				'react/lib/ExecutionEnvironment' : true,
				'react/lib/ReactContext'         : true,
			},
			plugins   : [
				new webpack.ProvidePlugin({
					fetch : "isomorphic-fetch"
				}),
			],
			module    : {
				loaders     : [
					{
						test   : /\.json$/,
						loader : 'json',
					},
					{
						test   : require.resolve('react'),
						loader : "expose?React",
					},
					{
						test    : /\.(ts|tsx)$/,
						loaders : [
							'babel?cacheDirectory&presets[]=es2015-loose&plugins[]=jsx-control-statements&plugins[]=transform-react-jsx',
							'ts',
						],
						exclude : [
							/node_modules/
						]
					},
					{
						test    : /(\.jpg|\.png|\.gif|\.svg)$/,
						loader  : "file?name=images/[name].[hash:6].[ext]",
						exclude : [
							/fonts/,
							/node_modules/
						]
					},
					{
						test    : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
						loader  : "file?name=fonts/[name].[hash:6].[ext]",
						exclude : [
							/images/,
							/node_modules/
						]
					}
				],
				postLoaders : [
					{
						test    : /\.(ts|tsx)$/,
						exclude : /(tests|node_modules)\//,
						loader  : 'istanbul-instrumenter'
					}
				]
			},
			stats     : {
				modules  : false,
				colors   : true,
				reasons  : false,
				children : false,
				chunks   : false
			}
		},
		webpackMiddleware : {
			noInfo : true
		},
	});
};
