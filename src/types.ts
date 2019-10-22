import { Request, Response } from 'express'

export interface WhenRequest {
  request: Request
  response: Response
}

export interface WhenCustomRoute extends WhenRequest {
  mountPoint: string
}

export interface RouteConfig {
  mountPoint: string
  /**
   * Use any middleware for a specific route
   */
  uses?: any[]
}

export interface ExpressMoldRoute {
  get?: Array<string | RouteConfig>
  post?: Array<string | RouteConfig>
  put?: Array<string | RouteConfig>
  patch?: Array<string | RouteConfig>
}

export interface ExpressMold {
  port?: number
  uses?: any[]
  routes: ExpressMoldRoute
}
