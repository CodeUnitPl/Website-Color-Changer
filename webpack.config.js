var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    javascript: './src/scripts/main.js',
    html: './src/templates/index.jade',
    css: './src/styles/main.styl'
  },
  output: { 
    path: __dirname,
    filename: './output/bundle.js',
    publicPath: './output/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.jade', '.styl']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /.jade?$/,
        loader: 'file?name=./output/index.html!jade-html-loader'
      },
      {
        test: /.styl?$/,
        loader: 'file?name=./output/main.css!stylus-loader'
      }
    ]
  },
};