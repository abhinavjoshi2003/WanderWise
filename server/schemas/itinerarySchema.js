
import { z } from 'zod'

const stopSchema = z.object({
  name: z.string().trim().min(1).max(120),

  description: z.string().trim().min(1).max(500),

  category: z.enum([
    'Sightseeing',
    'Adventure',
    'Food',
    'Shopping',
    'Relaxation',
    'Transport',
    'Other'
  ]),

  estimatedDuration: z.string().trim().min(1).max(50),

  estimatedCost: z.number().nonnegative().max(10000000),

  location: z.string().trim().min(1).max(150),

  tips: z.string().trim().max(300)
}).strict()

const daySchema = z.object({
  day: z.number().int().positive(),

  title: z.string().trim().min(1).max(120),

  stops: z.array(stopSchema).min(2).max(5)
}).strict()

export const itinerarySchema = z.object({
  tripTitle: z.string().trim().min(1).max(150),

  destination: z.string().trim().min(1).max(150),

  duration: z.number().int().min(1).max(14),

  totalEstimatedBudget: z.number().nonnegative().max(100000000),

  currency: z.literal('INR'),

  days: z.array(daySchema).min(1).max(14)
}).strict().refine(
  (itinerary) => itinerary.days.length === itinerary.duration,
  {
    message: 'Number of days must match trip duration',
    path: ['days']
  }
).refine(
  (itinerary) => itinerary.days.every(
    (day, index) => day.day === index + 1
  ),
  {
    message: 'Day numbers must be sequential',
    path: ['days']
  }
)

// Saved itinerary schema: allows frontend stop IDs.
const savedStopSchema = stopSchema.extend({
  id: z.string().min(1).max(100).optional()
}).strict()

const savedDaySchema = z.object({
  day: z.number().int().positive(),
  title: z.string().trim().min(1).max(120),
  stops: z.array(savedStopSchema).min(2).max(5)
}).strict()

export const savedItinerarySchema = z.object({
  tripTitle: z.string().trim().min(1).max(150),
  destination: z.string().trim().min(1).max(150),
  duration: z.number().int().min(1).max(14),
  totalEstimatedBudget: z.number().nonnegative().max(100000000),
  currency: z.literal('INR'),
  days: z.array(savedDaySchema).min(1).max(14)
}).strict().refine(
  (itinerary) => itinerary.days.length === itinerary.duration,
  {
    message: 'Number of days must match trip duration',
    path: ['days']
  }
).refine(
  (itinerary) => itinerary.days.every(
    (day, index) => day.day === index + 1
  ),
  {
    message: 'Day numbers must be sequential',
    path: ['days']
  }
)
