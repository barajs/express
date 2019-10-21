import { portion, flow, popEvent, popSeep } from '@barajs/core'
import express, { Application } from 'express'

import { WhenRequest, ExpressMold } from './types'
import * as expressFlows from './flow'

const ExpressServer = portion<WhenRequest, Application, ExpressMold>({
  name: 'bara-express',
  mold: { port: +process.env.PORT! || 3456 },
  init: () => {
    const expressApp: Application = express()
    return expressApp
  },
  whenInitialized: flow({
    bootstrap: ({ context: expressApp, next, mold }: any) => {
      const { port, middlewares } = mold
      if (middlewares && middlewares.length > 0) {
        for (const mw of middlewares) expressApp.use(mw)
      }
      expressApp.listen(port, function() {
        next({ port })
      })
    },
  }),
  ...expressFlows,
})

const {
  whenInitialized: whenExpressStarted,
  whenAnyGet,
  whenAnyPost,
} = popEvent(ExpressServer)

const { hasGetQuery, hasGetPath } = popSeep(whenAnyGet)
const { hasPostQuery, hasPostPath } = popSeep(whenAnyPost)

export {
  whenExpressStarted,
  whenAnyGet,
  whenAnyPost,
  hasGetQuery,
  hasGetPath,
  hasPostQuery,
  hasPostPath,
}

export * from './types'
export * from './curry'
export default ExpressServer
