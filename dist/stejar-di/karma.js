const path    = require('path');
const webpack = require('webpack');

module.exports = function (config) {
	config.set({
		browsers          : [ 'PhantomJS' ],
		singleRun         : true,
		files             : [
			'node_modules/babel-polyfill/dist/polyfill.js',
			'node_modules/phantomjs-polyfill-find/find-polyfill.js',
			'tests/**/*.test.{ts,tsx}',
		],
		frameworks        : [
			'jasmine',
		],
		reporters         : [ 'progress', 'coverage' ],
		preprocessors     : {
			'tests/**/*.test.ts'  : [ 'webpack', 'sourcemap' ],
			'tests/**/*.test.tsx' : [ 'webpack', 'sourcemap' ],
			'src/**/*'            : [ 'coverage' ],
		},
		coverageReporter  : {
			type : 'html',
			dir  : 'coverage/'
		},
		webpack           : {
			cache     : true,
			resolve   : {
				extensions : [ '', '.js', '.ts', '.tsx' ],
				alias      : {
					'cheerio' : 'cheerio/lib/cheerio'
				}
			},
			externals : {
				'jsdom' : true,
			},
			plugins   : [],
			module    : {
				loaders     : [
					{
						test   : /\.json$/,
						loader : 'json',
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
