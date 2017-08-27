import Router from 'koa-router'

const Apirouter = new Router()

Apirouter.get('api/hello', (ctx, next) => {
  ctx.body = JSON.stringify({
    data: 'hello world'
  })
})

Apirouter.get('api/error', (ctx, next) => {
  throw new Error('this is a error')
})

export default Apirouter
