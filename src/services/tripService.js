
const API_URL = import.meta.env.VITE_API_URL

export async function generateTrip(description, signal) {
  let response

  try {
    response = await fetch(
      `${API_URL}/api/trips/generate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
        signal,
      }
    )
  } catch (error) {
    // Preserve cancellation so the hook can handle it
    if (error.name === 'AbortError') {
      throw error
    }

    throw new Error(
      'Unable to connect to the server. Check whether the backend is running.'
    )
  }

  let result

  try {
    result = await response.json()
  } catch {
    throw new Error(
      'The server returned an invalid response.'
    )
  }

  if (!response.ok) {
    throw new Error(
      result.message || `Request failed with status ${response.status}.`
    )
  }

  if (
    !result ||
    result.success !== true ||
    !result.data ||
    !Array.isArray(result.data.days)
  ) {
    throw new Error(
      'The server returned an unexpected itinerary format.'
    )
  }

  return result.data
}
