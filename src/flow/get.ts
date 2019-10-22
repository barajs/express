import { flow } from '@barajs/core'
import { Application, Request, Response, NextFunction } from 'express'

import {
  WhenRequest,
  ExpressMold,
  RouteConfig,
  WhenCustomRoute,
} from '../types'
import { hasQuery, hasPath, hasMountPoint } from '../seep'

export const whenCustomGet = flow<WhenCustomRoute, Application, ExpressMold>({
  bootstrap: ({ context: expressApp, mold, next }) => {
    const {
      routes: { get },
    } = mold
    for (const route of get) {
      const isPureMountPoint = typeof route === 'string'
      const mountPoint: string = isPureMountPoint
        ? (route as string)
        : (route as RouteConfig).mountPoint

      const middleware =
        !isPureMountPoint && 'mountPoint' in (route as RouteConfig)
          ? (req: Request, res: Response, next: NextFunction) => {
              const uses = (route as RouteConfig).uses || []
              for (const use of uses) {
                use(req, res, next)
              }
            }
          : null

      console.log(
        `custom get: ${route} - mountPoint ${mountPoint} - middleware: ${middleware}`,
      )

      if (middleware) {
        expressApp.use(
          mountPoint,
          middleware,
          (request: Request, response: Response) => {
            console.log(request, response, mountPoint)
            next({ request, response, mountPoint })
          },
        )
      } else {
        console.log(`Normal custom get`, mountPoint)
        expressApp.get(mountPoint, (request: Request, response: Response) => {
          next({ request, response, mountPoint })
        })
      }
    }
  },
  seep: {
    hasMountPoint,
    hasGetQuery: hasQuery,
    hasGetPath: hasPath,
  },
})

export const whenRootGet = flow<WhenRequest, Application, ExpressMold>({
  bootstrap: ({ context: expressApp, next }) => {
    expressApp.get('/', (request: Request, response: Response) => {
      next({ request, response })
    })
  },
  seep: { hasGetQuery: hasQuery },
})

/**
 * This flow must be place in the most end of this file because
 * Express do register the route in order, if put this function
 * before any get route, it would overlap all the route below it.
 */
export const whenAnyGet = flow<WhenRequest, Application, ExpressMold>({
  bootstrap: ({ context: expressApp, next }) => {
    expressApp.get('*', (request: Request, response: Response) => {
      next({ request, response })
    })
  },
  seep: { hasGetQuery: hasQuery, hasGetPath: hasPath },
})
