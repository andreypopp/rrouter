var path = require('path')

module.exports = {
  context: __dirname,
  entry: './index.js',
  output: {
    path: __dirname + '/assets',
    publicPath: 'assets/',
    filename: 'bundle.js',
    chunkFilename: '[id].js'
  },
  resolve: {
    alias: {
      rrouter: path.resolve('../../')
    }
  },
  module: {
    loaders: [
      {include: /.*\.js$/, loader: 'jsx-loader?harmony'}
    ]
  },
  console: true,
  cache: true
}
