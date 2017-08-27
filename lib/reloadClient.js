const reload = require('koa-reload')
const http = require('http')

module.exports = function (app) {
  const reSer = http.createServer(app.callback())
  const Reloadrouter = reload(reSer).Reloadrouter
  return { reSer, Reloadrouter }
}
