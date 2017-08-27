import Koa from 'koa'
import Router from 'koa-router'
import views from 'koa-views'
import path from 'path'
import server from 'koa-static'
import yargs from 'yargs'
import MdWare from './server/middleware'
import Apirouter from './server/routes/api'

const app = new Koa()
const Rootrouter = new Router()
const version = yargs.argv.vs
const PORT = 3000
const env = process.env.NODE_ENV.trim()
const mdObj = new MdWare(env, version)

// app.use(mdObj.filterError())
// app.use(mdObj.reqLog())
app.use(server('client/'))
app.use(views(path.join(__dirname, 'views'), {
  extension: 'pug'
}))
if (env === 'development') {
  const { reSer, Reloadrouter } = require('./lib/reloadClient.js')(app)
  require('./lib/webpackDevServer.js')(app, version)

  Rootrouter.use(Reloadrouter.routes(), Reloadrouter.allowedMethods())
  Rootrouter.use(Apirouter.routes(), Apirouter.allowedMethods())
  app.use(Rootrouter.routes(), Rootrouter.allowedMethods())
  app.use(mdObj.serverRender())

  reSer.listen(3000, () => {
    console.log('listen 3000')
  })
} else {
  app.use(mdObj.serverRender())
  app.use(Rootrouter.routes(), Rootrouter.allowedMethods())

  app.listen(PORT)
}

export default app
