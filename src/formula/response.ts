import { StreamPayload } from '@barajs/core'
import { Formula } from '@barajs/formula'

import { WhenRequest } from '../types'

/**
 * Express response JSON to the specific request
 * @param formula
 */
export const sendJSONResultOf = (formula: Formula) => async (
  payload: WhenRequest,
  ...rest: any[]
) => {
  const { response } = payload
  try {
    const data = await formula(payload, ...rest)
    response.json({ success: true, data })
  } catch (err) {
    response.json({ success: false, message: err.message })
  }
}

/**
 * Send express response as raw document
 * @param formula
 */
export const sendRawResultOf = (formula: Formula) => async (
  payload: WhenRequest,
  ...rest: any[]
) => {
  const { response } = payload
  try {
    const data = await formula(payload, ...rest)
    response.send(data)
  } catch (err) {
    response.send(err.message)
  }
}

/**
 * Send static file to client
 */
export const sendFile = (filePath: string | Formula) => async (
  payload: WhenRequest,
  ...rest: any[]
) => {
  const { response } = payload
  if (typeof filePath === 'string') {
    response.sendFile(filePath)
  } else {
    const path = await Promise.resolve(filePath(payload, ...rest))
    response.sendFile(path)
  }
}
