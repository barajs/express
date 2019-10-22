import { WhenRequest } from '../types'

export const hasQuery = (query?: string) => ({ request }: WhenRequest) => {
  return !!request.query && query && query in request.query
}

export const hasPath = (path?: string) => ({ request }: WhenRequest) => {
  return request.originalUrl === path
}

export const hasMountPoint = (mountPoint: string) => ({
  request,
}: WhenRequest) => {
  return request.route.path === mountPoint
}

export const hasParam = (
  paramName: string,
  equatation: (value: any) => boolean | string | number | boolean,
) => ({ request }: WhenRequest) => {
  return paramName in request.params
    ? typeof equatation === 'function'
      ? equatation(request.params[paramName])
      : request.params[paramName] === (equatation as any)
    : false
}
