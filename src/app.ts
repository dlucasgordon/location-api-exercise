import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

const port = process.env.SERVER_PORT
const app  = express()
const api  = express.Router()

api.get('/nearest-neighbors', (req, res) => {
  res.send('Hello, world!')
})

app.use('/api', api)
app.listen(port, () =>
  console.log(`Listening on port ${port}...`)
)
