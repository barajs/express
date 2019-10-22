import { run, app, act, cond } from '@barajs/core'

import Express, {
  whenExpressStarted,
  whenAnyGet,
  whenAnyPost,
  whenCustomGet,
  hasGetQuery,
  hasMountPoint,
  WhenRequest,
  hasPostPath,
  WhenCustomRoute,
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
        act(() => console.log('Hello from Bara trigger')),
      ),
      whenAnyGet(
        cond(
          hasGetQuery('first'),
          act(({ request, response }: WhenRequest) => {
            const { query } = request
            response.send({ success: true, query })
          }),
        ),
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
