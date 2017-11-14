var webpack = require('webpack');

module.exports = {
	entry		: './src/iAjax.js',
	output		: {
		path			: __dirname+'/dist',
		filename		: 'iAjax.js',
		// library			: 'iAjax',
		libraryTarget	: 'amd'
	},
	module		: {
		loaders		: [
			{ text: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
		]
	}/*,
	plugins		: [
		new webpack.optimize.UglifyJsPlugin({ sourceMap: true })
	]*/
};
