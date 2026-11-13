
import { getBrowserId } from '../utils/browserId'

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000'

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(
    `${API_URL}/api/trips/saved${endpoint}`,
    {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Wanderwise-Client-Id': getBrowserId(),
        ...options.headers,
      },
    }
  )

  const result = await response.json()

  if (!response.ok) {
    throw new Error(
      result.message || 'Unable to process saved trip request.'
    )
  }

  return result
}

export async function fetchSavedTrips() {
  const result = await apiRequest('')

  return result.data
}

export async function saveTripAPI(description, itinerary, legacyId) {
  const result = await apiRequest('', {
    method: 'POST',
    body: JSON.stringify({
      description,
      itinerary,
      legacyId,
    }),
  })

  return result.data
}

export async function deleteTripAPI(tripId) {
  const result = await apiRequest(`/${encodeURIComponent(tripId)}`, {
    method: 'DELETE',
  })

  return result
}
