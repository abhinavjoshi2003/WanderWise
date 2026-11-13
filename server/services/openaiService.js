
import OpenAI from 'openai'
import { zodTextFormat } from 'openai/helpers/zod'
import { itinerarySchema } from '../schemas/itinerarySchema.js'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Generate itinerary using OpenAI
export async function generateItinerary(tripDescription) {

  const response = await openai.responses.parse({
    model: process.env.OPENAI_MODEL,
    store: false,

    input: [
      {
        role: 'system',
        content: `
You are an experienced travel planner.

Generate practical, realistic and personalized
day-by-day travel itineraries.

Follow these rules:

1. Match the requested trip duration.
2. Include 2 to 5 meaningful stops per day.
3. Keep estimated costs realistic.
4. All costs must be in Indian Rupees.
5. Avoid overcrowding the daily schedule.
6. Consider geographical proximity.
7. Include useful tips for each destination.
8. Do not invent exact opening hours.
9. Do not claim prices are live verified.
10. If details are missing, make reasonable assumptions.

Return structured itinerary data.
`
      },
      {
        role: 'user',
        content: tripDescription
      }
    ],

    text: {
      format: zodTextFormat(
        itinerarySchema,
        'travel_itinerary'
      )
    }
  })

  // Handle missing structured output
  if (!response.output_parsed) {
    throw new Error('EMPTY_AI_RESPONSE')
  }

  // Independently validate the result
  const validation = itinerarySchema.safeParse(
    response.output_parsed
  )

  if (!validation.success) {
    console.error(
      'Validation errors:',
      validation.error.issues
    )

    throw new Error('INVALID_AI_STRUCTURE')
  }

  return validation.data
}
