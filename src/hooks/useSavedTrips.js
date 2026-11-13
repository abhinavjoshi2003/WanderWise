
import { useCallback, useEffect, useState } from 'react'

import {
  fetchSavedTrips,
  saveTripAPI,
  deleteTripAPI,
} from '../services/savedTripService'

const STORAGE_KEY = 'wanderwise_saved_trips'

// Read existing localStorage data for migration.
function getLegacyTrips() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)

    if (!stored) return []

    const parsed = JSON.parse(stored)

    if (!Array.isArray(parsed)) return []

    return parsed.filter(
      (trip) =>
        trip &&
        typeof trip.id === 'string' &&
        typeof trip.description === 'string' &&
        trip.itinerary &&
        Array.isArray(trip.itinerary.days)
    )
  } catch (error) {
    console.error('Unable to read legacy trips:', error)
    throw new Error('Unable to read existing saved trips.')
  }
}

export function useSavedTrips() {
  const [savedTrips, setSavedTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Load MongoDB trips and migrate existing local trips.
  useEffect(() => {
    let active = true

    async function initializeTrips() {
      try {
        setLoading(true)
        setError('')

        // First retrieve existing server-side trips.
        await fetchSavedTrips()

        // Read previous browser storage.
        const legacyTrips = getLegacyTrips()

        // Migrate old trips without creating duplicates.
        for (const trip of legacyTrips) {
          await saveTripAPI(
            trip.description,
            trip.itinerary,
            trip.id
          )
        }

        // Fetch the final updated list.
        const trips = await fetchSavedTrips()

        if (!active) return

        setSavedTrips(trips)

        // Remove old storage only after successful migration.
        if (legacyTrips.length > 0) {
          localStorage.removeItem(STORAGE_KEY)
        }

      } catch (err) {
        console.error('Unable to initialize saved trips:', err)

        if (active) {
          setError(err.message || 'Unable to load saved trips.')
        }

      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    initializeTrips()

    return () => {
      active = false
    }
  }, [])

  // Save a new itinerary.
  const saveTrip = useCallback(async (description, itinerary) => {
    try {
      const trip = await saveTripAPI(description, itinerary)

      setSavedTrips((previous) => [
        trip,
        ...previous,
      ])

      return trip.id

    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  // Delete a saved itinerary.
  const deleteTrip = useCallback(async (tripId) => {
    try {
      await deleteTripAPI(tripId)

      setSavedTrips((previous) =>
        previous.filter((trip) => trip.id !== tripId)
      )

    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  return {
    savedTrips,
    saveTrip,
    deleteTrip,
    loading,
    error,
  }
}
