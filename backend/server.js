import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import xssClean from 'xss-clean'
import hpp from 'hpp'
import cors from 'cors'

import cloudinary from 'cloudinary'

const app = express()

// connection to db
import connectDb from './database/db.js'

// global middlewares
dotenv.config()
import 'express-async-errors'

// sanitize the data
app.use(mongoSanitize())

// prevent xss-attacks
app.use(xssClean())

// prevent parameter pollution
app.use(hpp())

// Rate Limiting -> 150 req per user in 10 mints
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 150,
})

app.use(limiter)

// cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(
  cors({
    origin: 'https://blogify-world.netlify.app',
  })
)

// errors
import errorMiddleware from './middlewares/errorMiddleware.js'
import { notFound } from './middlewares/notFound.js'

// routes
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'

// route middlewares
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/posts', postRoutes)

// error handling middlwares
app.use(errorMiddleware)
app.use(notFound)

const PORT = process.env.PORT || 5000

const spinServer = async () => {
  try {
    await connectDb()
    app.listen(PORT)
    console.log('Server is up')
  } catch (error) {
    console.log(error.message)
  }
}

spinServer()
