const devRoutes = [{
  method: 'get',
  path: 'api/hello',
  handle: (ctx, next) => {
    ctx.body = JSON.stringify({
      data: 'hello world'
    })
  }
}]

export default devRoutes
