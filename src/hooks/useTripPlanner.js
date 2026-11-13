
import { useCallback, useRef, useState } from 'react'
import { generateTrip } from '../services/tripService'

export function useTripPlanner() {
  const [itinerary, setItinerary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const controllerRef = useRef(null)

  const generate = useCallback(async (description) => {

    // Cancel the previous request, if one exists
    if (controllerRef.current) {
      controllerRef.current.abort()
    }

    const controller = new AbortController()
    controllerRef.current = controller

    let timedOut = false

    // Set a 60-second timeout
    const timeoutId = setTimeout(() => {
      timedOut = true
      controller.abort()
    }, 60000)

    setLoading(true)
    setError('')
    setItinerary(null)

    try {
      const data = await generateTrip(
        description,
        controller.signal
      )

      // Accept only the latest request
      if (controllerRef.current === controller) {
        setItinerary(data)
      }

    } catch (err) {

      // Handle timeout separately from manual cancellation
      if (err.name === 'AbortError') {
        if (
          timedOut &&
          controllerRef.current === controller
        ) {
          setError(
            'The request took too long. Please try again.'
          )
        }

        return
      }

      if (controllerRef.current === controller) {
        setError(err.message || 'Something went wrong.')
      }

    } finally {
      clearTimeout(timeoutId)

      // Only the latest request can update loading state
      if (controllerRef.current === controller) {
        controllerRef.current = null
        setLoading(false)
      }
    }
  }, [])

  return {
    itinerary,
    loading,
    error,
    generate,
    setItinerary,
  }
}
