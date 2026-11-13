
import express from 'express'
import { z } from 'zod'
import { generateItinerary } from '../services/openaiService.js'
import mongoose from 'mongoose'
import SavedTrip from '../models/SavedTrip.js'
import { itinerarySchema, savedItinerarySchema } from '../schemas/itinerarySchema.js'

const router = express.Router()

const tripRequestSchema = z.object({
  description: z.string()
    .trim()
    .min(10, 'Please describe your trip in more detail.')
    .max(2000, 'Trip description cannot exceed 2000 characters.')
})

// Validate browser identifier
function getOwnerId(req, res) {
  const ownerId = req.get('X-Wanderwise-Client-Id')

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

  if (!ownerId || !uuidPattern.test(ownerId)) {
    res.status(400).json({
      success: false,
      message: 'A valid browser identifier is required.',
    })

    return null
  }

  return ownerId
}

// Validate saved itinerary request
const saveTripSchema = z.object({
  description: z.string().trim().min(10).max(2000),
  itinerary: savedItinerarySchema,
  legacyId: z.string().uuid().optional(),
}).strict()


router.post('/generate', async (req, res) => {
  try {
    // 1. Validate user input
    const input = tripRequestSchema.safeParse(req.body)

    if (!input.success) {
      return res.status(400).json({
        success: false,
        message: input.error.issues[0].message
      })
    }

    // 2. Generate itinerary using Gemini
    const itinerary = await generateItinerary(
      input.data.description
    )

    // 3. Add unique IDs for frontend interactions
    const itineraryWithIds = {
      ...itinerary,
      days: itinerary.days.map(day => ({
        ...day,
        stops: day.stops.map((stop, index) => ({
          ...stop,
          id: `day-${day.day}-stop-${index + 1}`
        }))
      }))
    }

    // 4. Return structured response
    return res.status(200).json({
      success: true,
      data: itineraryWithIds
    })

  } catch (error) {
    console.error('Trip generation failed:', error)

    if (error.message === 'EMPTY_AI_RESPONSE' ||
        error.message === 'INVALID_AI_JSON' ||
        error.message === 'INVALID_AI_STRUCTURE') {
      return res.status(502).json({
        success: false,
        code: 'AI_INVALID_RESPONSE',
        message: 'The AI returned an invalid itinerary. Please try again.'
      })
    }

    if (error.status === 429) {
      return res.status(503).json({
        success: false,
        code: 'AI_RATE_LIMITED',
        message: 'The AI service is currently busy. Please try again later.'
      })
    }

    return res.status(502).json({
      success: false,
      code: 'AI_GENERATION_FAILED',
      message: 'Unable to generate your itinerary right now. Please retry.'
    })
  }
})

router.get('/saved', async (req, res, next) => {
  try {
    const ownerId = getOwnerId(req, res)
    if (!ownerId) return

    const trips = await SavedTrip.find({ ownerId })
      .sort({ savedAt: -1 })
      .lean()

    const data = trips.map((trip) => ({
      id: trip._id.toString(),
      description: trip.description,
      itinerary: trip.itinerary,
      savedAt: trip.savedAt,
    }))

    return res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    next(error)
  }
})

router.post('/saved', async (req, res, next) => {
  try {
    const ownerId = getOwnerId(req, res)
    if (!ownerId) return

    const validation = saveTripSchema.safeParse(req.body)

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.error.issues[0].message,
      })
    }

    const { description, itinerary, legacyId } = validation.data

    // Avoid creating duplicate entries during migration.
    let trip

    if (legacyId) {
      trip = await SavedTrip.findOneAndUpdate(
        { ownerId, legacyId },
        {
          $setOnInsert: {
            ownerId,
            legacyId,
            description,
            itinerary,
            savedAt: new Date(),
          },
        },
        {
          upsert: true,
          returnDocument: 'after',
          runValidators: true,
        }
      )
    } else {
      trip = await SavedTrip.create({
        ownerId,
        description,
        itinerary,
      })
    }

    return res.status(201).json({
      success: true,
      message: 'Trip saved successfully.',
      data: {
        id: trip._id.toString(),
        description: trip.description,
        itinerary: trip.itinerary,
        savedAt: trip.savedAt,
      },
    })
  } catch (error) {
    next(error)
  }
})

router.delete('/saved/:id', async (req, res, next) => {
  try {
    const ownerId = getOwnerId(req, res)
    if (!ownerId) return

    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid trip ID.',
      })
    }

    const deletedTrip = await SavedTrip.findOneAndDelete({
      _id: id,
      ownerId,
    })

    if (!deletedTrip) {
      return res.status(404).json({
        success: false,
        message: 'Saved trip not found.',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Trip deleted successfully.',
    })
  } catch (error) {
    next(error)
  }
})

export default router
