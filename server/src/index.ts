import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import * as trpcExpress from '@trpc/server/adapters/express'

import 'dotenv/config'

import router from './routers'
import createContext from './context'

// express setup
//////////////////////////////////////////
const app = express()

app.use(bodyParser.json({ limit: '1GB' }))
app.use(cors())

// tRPC setup
////////////////////////////////////////t
app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router,
    createContext,
  })
)

// paths accessible outside of tRPC
//////////////////////////////////////////
app.use('/api/static/ml', express.static('ml'))

// default configuration
//////////////////////////////////////////
const port = 8080
const host = 'localhost'
const basePath = 'trpc'

// start the standalone server; not needed if just running Sveltekit website
//////////////////////////////////////////
app.listen(port, () => {
  console.log(`🚀 Server ready at http://${host}:${port}/${basePath}`)
})
