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
      const { port, uses } = mold
      if (uses && uses.length > 0) {
        for (const middleware of uses) expressApp.use(middleware)
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
  whenRootGet,
  whenCustomGet,
  whenAnyPost,
} = popEvent(ExpressServer)

const { hasGetQuery, hasGetPath } = popSeep(whenAnyGet)
const { hasMountPoint } = popSeep(whenCustomGet)

const { hasPostQuery, hasPostPath } = popSeep(whenAnyPost)

export {
  whenExpressStarted,
  // HTTP Get
  whenAnyGet,
  whenRootGet,
  whenCustomGet,
  hasGetQuery,
  hasGetPath,
  hasMountPoint,
  // HTTP Post
  whenAnyPost,
  hasPostQuery,
  hasPostPath,
}

export * from './types'
export * from './curry'
export default ExpressServer
