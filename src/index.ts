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
  whenCustomPost,
  whenAnyPost,
} = popEvent(ExpressServer)

const { hasGetQuery, hasGetPath } = popSeep(whenAnyGet)
const { hasMountPoint } = popSeep(whenCustomGet)
const { hasPostMountPoint } = popSeep(whenCustomPost)

const { hasPostQuery, hasPostPath } = popSeep(whenAnyPost)

export {
  ExpressServer,
  whenExpressStarted,
  // HTTP Get
  whenAnyGet,
  whenRootGet,
  whenCustomGet,
  whenCustomPost,
  hasGetQuery,
  hasGetPath,
  hasMountPoint,
  // HTTP Post
  whenAnyPost,
  hasPostQuery,
  hasPostPath,
  hasPostMountPoint,
}

export * from './types'
export * from './curry'
export default ExpressServer
