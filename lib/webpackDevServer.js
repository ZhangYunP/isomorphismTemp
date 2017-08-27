const webpack = require('webpack')
const koaWebpack = require('koa-webpack')
const devConf = require('../webpack.config')

module.exports = function (app, version) {
  devConf.entry.index.unshift('webpack-hot-middleware/client?reload=true')
  devConf.output.publicPath = '/v' + version + '/dist/scripts/'
  devConf.plugins.push(new webpack.HotModuleReplacementPlugin())

  const compile = webpack(devConf)
  app.use(koaWebpack({
    compiler: compile,
    dev: {
      publicPath: devConf.output.publicPath,
      noInfo: true,
      stats: {
        colors: true
      }
    }
  }))
}
