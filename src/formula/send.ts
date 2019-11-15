import { WhenRequest } from '../types'
import { Formula } from '@barajs/formula'

/**
 * Send a response in JSON format.
 * @param formula Formula to calculating before send.
 */
export const sendAsJSON = (formula: Formula) => async (
  payload: WhenRequest,
  ...rest: any[]
) => {
  const data = await Promise.resolve(formula(payload, ...rest))
  payload.response.json(data)
  return data
}
