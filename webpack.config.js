var path = require('path');

module.exports = {
  entry: {
    'dist/content.': './loader.js',
    'dist/background.': './background.js'
  },
  output: {
    path: __dirname,
    filename: '[name]bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  }
};