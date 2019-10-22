import { StreamPayload } from '@barajs/core'

import { WhenRequest } from '../types'

/**
 * Express response JSON to the specific request
 * @param callback
 */
export const sendJSONResultOf = (
  callback: (payload: StreamPayload) => Promise<any>,
) => async (payload: WhenRequest) => {
  const { response } = payload
  try {
    const data = await callback(payload)
    response.json({ success: true, data })
  } catch (err) {
    response.json({ success: false, message: err.message })
  }
}

/**
 * Send express response as raw document
 * @param callback
 */
export const sendRawResultOf = (
  callback: (payload: StreamPayload) => Promise<any>,
) => async (payload: WhenRequest) => {
  const { response } = payload
  try {
    const data = await callback(payload)
    response.send(data)
  } catch (err) {
    response.send(err.message)
  }
}

/**
 * Send static file to client
 */
export const sendFile = (filePath: string) => ({ response }: WhenRequest) => {
  response.sendFile(filePath)
}
