
import 'dotenv/config'

import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { rateLimit } from 'express-rate-limit'

import tripRoutes from './routes/tripRoutes.js'
import { connectDB } from './config/db.js'

const app = express()

const PORT = Number(process.env.PORT) || 5000
const isProduction = process.env.NODE_ENV === 'production'

// Validate required environment variables
const requiredEnv = [
  'OPENAI_API_KEY',
  'OPENAI_MODEL',
  'MONGODB_URI',
]

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`)
    process.exit(1)
  }
}

// Require an explicit frontend URL in production
if (isProduction && !process.env.CLIENT_URL) {
  console.error('Missing required environment variable: CLIENT_URL')
  process.exit(1)
}

// Configure allowed frontend origins
const allowedOrigins = (
  process.env.CLIENT_URL || 'http://localhost:5173'
)
  .split(',')
  .map(origin => origin.trim().replace(/\/$/, ''))
  .filter(Boolean)

// Trust Render's reverse proxy for client IP detection
app.set('trust proxy', 1)

// Disable Express fingerprinting header
app.disable('x-powered-by')

// CORS configuration
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error('Origin not allowed by CORS'))
  },
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Wanderwise-Client-Id',
  ],
}))

// Parse JSON requests
app.use(express.json({
  limit: '10kb',
}))

// Health check
app.get('/api/health', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1

  res.status(dbConnected ? 200 : 503).json({
    success: dbConnected,
    message: dbConnected
      ? 'WanderWise API is running!'
      : 'Database connection unavailable.',
    database: dbConnected ? 'connected' : 'disconnected',
  })
})

// Rate limiter for AI generation
const tripLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many trip generation requests. Please try again later.',
  },
})

// Trip routes
app.use('/api/trips/generate', tripLimiter)
app.use('/api/trips', tripRoutes)

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found.',
  })
})

// Centralized error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err.message)

  if (res.headersSent) {
    return next(err)
  }

  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    err.type === 'entity.parse.failed'
  ) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON request body.',
    })
  }

  if (err.message === 'Origin not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'Origin not allowed.',
    })
  }

  return res.status(500).json({
    success: false,
    message: 'An unexpected server error occurred.',
  })
})

// Start server after MongoDB connection
let server

async function startServer() {
  try {
    await connectDB()

    server = app.listen(PORT, () => {
      console.log(`WanderWise server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Unable to start WanderWise:', error.message)
    process.exit(1)
  }
}

// Graceful shutdown
async function shutdown(signal) {
  console.log(`${signal} received. Shutting down WanderWise...`)

  if (server) {
    server.close(async () => {
      try {
        await mongoose.disconnect()
        console.log('MongoDB disconnected. Server shut down.')
        process.exit(0)
      } catch (error) {
        console.error('Shutdown error:', error.message)
        process.exit(1)
      }
    })
  } else {
    await mongoose.disconnect()
    process.exit(0)
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

startServer()
