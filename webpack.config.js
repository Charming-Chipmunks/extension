var path = require('path');

module.exports = {
  entry: {
    'client/dist/': './client/components/webIndex.js',
    'extension/dist/content.': './extension/loader.js',
    'extension/dist/background.': './extension/background.js'
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