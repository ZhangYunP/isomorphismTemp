import pug from 'pug'
import React from 'react'
import { renderToString } from 'react-dom/server'
import stackTrace from 'stack-trace'
import { Provider } from 'react-redux'
import serialize from 'serialize-javascript'
import { match, RouterContext } from 'react-router'
import winston from 'winston'
import getRequsetinfo from '../../lib/request-info'
import routes from '../../app/routes/routes'
import configureStore from '../../app/store/configureStore'

class MdWare {
  constructor(env, version) {
    this.env = env
    this.version = version
    this.store = configureStore()
    this.dev = env.trim() === 'development' ? 1 : 0
  }

  reqLog() {
    return async (ctx, next) => {
      const { start, reqMethod, reqPath, reqProtocol, reqIp, reqTime, userAgent, referer } = getRequsetinfo(ctx)
      await next()
      const resCode = ctx.status
      const resTime = Date.now() - start
      const resLength = typeof ctx.length === 'undefined' ? 0 : ctx.length
      if (this.dev) {
        this.prodLog.info(`${reqIp} - - [${reqTime}] "${reqMethod} ${reqPath} ${reqProtocol}" ${resCode} ${resTime} ${resLength} "${referer}" "${userAgent}"`)
      } else {
        this.prodLog.info(`${reqIp} - - [${reqTime}] "${reqMethod} ${reqPath} ${reqProtocol}" ${resCode} ${resTime} ${resLength} "${referer}" "${userAgent}"`)
      }
    }
  }

  serverRender() {
    return async (ctx, next) => {
      match({ routes, location: ctx.url }, (error, redirectLocation, renderProps) => {
        if (error) {
          ctx.status = 500
          ctx.body = pug.renderFile('./views/error.pug', { version: this.version })
        } else if (redirectLocation) {
          ctx.redirect(redirectLocation.pathname + redirectLocation.search)
        } else if (renderProps) {
          // this.store.dispatch(addActionCreator()) first fetch
          const initState = serialize(this.store.getState())
          const reactComponent = (
            <Provider store={this.store}>
              <RouterContext {...renderProps} />
            </Provider>
          )
          const htmlstring = renderToString(reactComponent)
          const html = pug.renderFile('./views/index.pug', { htmlstring, initState, env: this.env, version: this.version })
          ctx.status = 200
          ctx.body = html
        } else {
          ctx.status = 404
          ctx.body = pug.renderFile('./views/error.pug', { version: this.version })
        }
      })
      await next()
    }
  }

  filterError() {
    return async (ctx, next) => {
      try {
        await next()
      } catch (e) {
        const clientIp = ctx.ip
        this.devLog.error(`[ERROR] [CLIENT ${clientIp}] Errors has happened `)
        await ctx.render('error', { version: this.version })
      }
    }
  }

}

export default MdWare
