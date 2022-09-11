// the actual Node/Express server that will run the Sveltekit application
// this is file exported by the node adapter plugin
import { handler } from './build/handler.js'
import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())

// let SvelteKit handle everything else, including serving prerendered pages and static assets app.use(handler);
app.use(handler)

app.listen(3000, () => {
  console.log('listening on port 3000')
})
