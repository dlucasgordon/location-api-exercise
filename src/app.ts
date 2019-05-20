import dotenv from 'dotenv'
dotenv.config()

import express from 'express'

import api_router from './api_router'

const PORT = process.env.PORT

const app = express()
app.use(express.json())
app.use('/api', api_router)
app.listen(PORT, () =>
  console.log(`Listening on port ${PORT}...`)
)
