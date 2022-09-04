import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import 'dotenv/config'

import appRouter from './routers'
import createContext from './context'

import * as trpcExpress from '@trpc/server/adapters/express'

// express setup
const app = express()
app.use(bodyParser.json({ limit: '1GB' }))
app.use(cors())

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
)

const port = 8080
const host = 'localhost'
const basePath = 'trpc'

app.use('/api/static/ml', express.static('ml'))

app.listen(8080, () => {
  console.log(`🚀 Server ready at http://${host}:${port}/${basePath}`)
})
