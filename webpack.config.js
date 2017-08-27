const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')
const args = require('yargs').argv

const entryPath = path.resolve(__dirname, 'app/index.jsx')
const version = args.vs

const webpackConfig = {
  entry: {
    index: ['babel-polyfill', entryPath]
  },
  output: {
    path: path.resolve(__dirname, `client/v${version}/src/scripts`),
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss')
      },
      {
        test: /\.(jsx|js)$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpeg|jpg|gif)\?(.*?)$/,
        loader: `url?limit=3000&name=/client/v${version}/src/images/[name]-[hash:10].[ext]`
      },
      {
        test: /\.pug$/,
        loader: 'pug'
      },
      {
        test: /\.(ttf|eot|woff|svg)\?(.*?)$/,
        loader: `url?limit=3000&name=/client/v${version}/src/fonts/[name]-[hash:10].[ext]`
      }
    ]
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin(`./client/v${version}/src/css/[name].extract.css`)
  ],
  postcss: function () {
    return [autoprefixer({ browsers: ['last 2 versions'] })]
  }
}
module.exports = webpackConfig
