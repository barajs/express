import { run, app, act, cond, and, or } from '@barajs/core'

import Express, {
  whenExpressStarted,
  whenAnyGet,
  whenRootGet,
  whenAnyPost,
  whenCustomGet,
  hasGetQuery,
  hasMountPoint,
  WhenRequest,
  hasPostPath,
  WhenCustomRoute,
  hasGetPath,
  sendJSONResultOf,
} from './src'

run(
  app({
    portion: [
      Express({
        port: 3200,
        routes: {
          get: ['/item/:id'],
        },
      }),
    ],
    trigger: [
      whenExpressStarted(
        act(({ port }: any) =>
          console.log(`Express server started on http://localhost:${port}`),
        ),
        act(() => console.log('This is the demo Expres server with Bara')),
      ),
      whenRootGet(
        act(
          sendJSONResultOf(() =>
            Promise.resolve({ success: true, hello: 'world' }),
          ),
        ),
      ),
      whenAnyGet(
        cond(
          and(
            hasGetPath('first'),
            or(hasGetQuery('pretty'), hasGetQuery('clean')),
          ),
          act(({ request, response }: WhenRequest) => {
            const { query } = request
            response.send({ success: true, query })
          }),
        ),
        act(({ request }: WhenRequest) => {
          console.log(`[/GET] ${request.originalUrl}`)
        }),
      ),
      whenCustomGet(
        cond(
          hasMountPoint('/item/:id'),
          act(({ response, mountPoint }: WhenCustomRoute) => {
            response.send({ success: true, mountPoint })
          }),
        ),
      ),
      whenAnyPost(
        cond(
          hasPostPath('/webhook'),
          act(({ request, response }: WhenRequest) => {
            const { query, originalUrl } = request
            response.send({ success: true, query, originalUrl })
          }),
        ),
      ),
    ],
  }),
)
