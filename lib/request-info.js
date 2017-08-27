import moment from 'moment'

function getResusetinfo(ctx) {
  const start = Date.now()
  const reqMethod = ctx.method
  const reqPath = ctx.path + (ctx.search === '' ? '' : ctx.search)
  const reqProtocol = ctx.protocol + '/1.1'
  const reqIp = ctx.ip
  const reqTime = moment().format('DD/MM/YYYY:HH:mm:ss ZZ')
  const userAgent = ctx.header['user-agent']
  const referer = ctx.header['referer']
  return { start, reqMethod, reqPath, reqProtocol, reqIp, reqTime, userAgent, referer }
}
export default getResusetinfo
