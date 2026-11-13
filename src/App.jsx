
import { useState, useCallback } from 'react'
import {
  Compass,
  Sparkles,
  MapPin,
  CalendarDays,
  Wallet,
  ArrowRight,
  LoaderCircle,
  AlertCircle,
  Bookmark,
  Trash2,
  FolderOpen,
} from 'lucide-react'

import { useTripPlanner } from './hooks/useTripPlanner'
import { useSavedTrips } from './hooks/useSavedTrips'
import Toast from './components/Toast'
import Itinerary from './components/Itinerary'

function App() {
  const [description, setDescription] = useState('')
  const [toast, setToast] = useState(null)

  const closeToast = useCallback(() => {
    setToast(null)
  }, [])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  const {
    itinerary,
    loading,
    error,
    generate,
    setItinerary,
  } = useTripPlanner()

  const {
    savedTrips,
    saveTrip,
    deleteTrip,
    loading: savedTripsLoading,
    error: savedTripsError,
  } = useSavedTrips()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (description.trim().length < 10 || loading) {
      return
    }

    generate(description.trim())
  }

  // Remove a stop from a particular day
  const handleRemoveStop = (dayIndex, stopId) => {
    if (!window.confirm('Are you sure you want to remove this stop?')) {
      return
    }

    setItinerary((previous) => ({
      ...previous,
      days: previous.days.map((day, index) => {
        if (index !== dayIndex) return day

        return {
          ...day,
          stops: day.stops.filter(
            (stop) => stop.id !== stopId
          ),
        }
      }),
    }))

    showToast('Stop removed successfully!')
  }

  // Move a stop up or down within its day
  const handleMoveStop = (dayIndex, stopIndex, direction) => {
    setItinerary((previous) => ({
      ...previous,
      days: previous.days.map((day, index) => {
        if (index !== dayIndex) return day

        const stops = [...day.stops]
        const newIndex = stopIndex + direction

        if (newIndex < 0 || newIndex >= stops.length) {
          return day
        }

        ;[stops[stopIndex], stops[newIndex]] =
          [stops[newIndex], stops[stopIndex]]

        return {
          ...day,
          stops,
        }
      }),
    }))
  }

  // Save the currently generated itinerary
  const handleSaveTrip = async () => {
    if (!itinerary) return

    try {
      await saveTrip(description, itinerary)

      showToast('Your itinerary has been saved!')
    } catch (error) {
      showToast(
        error.message || 'Unable to save itinerary.',
        'error'
      )
    }
  }

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this saved trip?')) {
      return
    }

    try {
      await deleteTrip(tripId)

      showToast('Saved trip deleted successfully!')
    } catch (error) {
      showToast(
        error.message || 'Unable to delete saved trip.',
        'error'
      )
    }
  }

  // Load a previously saved itinerary
  const handleLoadTrip = (savedTrip) => {
    setDescription(savedTrip.description)
    setItinerary(savedTrip.itinerary)

    showToast('Your saved trip has been loaded!')
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-800">

      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">

          <div className="shrink-0 rounded-xl bg-indigo-600 p-2 text-white">
            <Compass size={22} />
          </div>

          <span className="text-lg font-bold tracking-tight sm:text-xl">
            WanderWise
          </span>

          <span className="ml-auto rounded-full bg-indigo-50 px-3 py-1.5 text-[11px] font-medium text-indigo-600 sm:text-xs">
            AI Trip Planner
          </span>

        </div>
      </nav>

      {/* Hero and input */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">

        <div className="mx-auto max-w-3xl text-center">

          {/* Hero badge */}
          <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-600 sm:px-4 sm:text-sm">
            <Sparkles size={16} className="shrink-0" />
            Your personal AI travel assistant
          </div>

          {/* Hero heading */}
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            Your next adventure,
            <span className="block text-indigo-600">
              planned intelligently.
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:mt-5 sm:text-base sm:leading-7">
            Describe your dream trip in your own words.
            Let AI turn your ideas into a personalized,
            day-by-day itinerary.
          </p>

          {/* Trip planning form */}
          <form
            onSubmit={handleSubmit}
            className="mt-7 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-lg shadow-slate-200/50 sm:mt-9 sm:p-6 md:p-7"
          >

            <label
              htmlFor="trip-description"
              className="mb-3 block text-sm font-semibold sm:text-base"
            >
              Where would you like to go?
            </label>

            <textarea
              id="trip-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Example: Plan a 3-day trip to Manali with friends. Our budget is ₹15,000 per person. We love adventure activities, sightseeing and local food..."
              rows={5}
              maxLength={2000}
              className="min-h-36 w-full resize-y rounded-xl border border-slate-200 p-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:p-4"
            />

            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 sm:text-xs">
              <span>Minimum 10 characters · Maximum 2000</span>
              <span className="tabular-nums">{description.length}/2000</span>
            </div>

            <button
              type="submit"
              disabled={loading || description.trim().length < 10}
              className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
            >
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin" size={19} />
                  Generating your itinerary...
                </>
              ) : (
                <>
                  Generate Itinerary
                  <ArrowRight size={19} />
                </>
              )}
            </button>

          </form>

          {/* Loading state */}
          
          {loading && (
            <div className="mt-8 rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm sm:p-6">

              <div className="flex items-center gap-3">
                <LoaderCircle
                  className="animate-spin text-indigo-600"
                  size={26}
                />

                <div className="text-left">
                  <p className="font-semibold text-slate-800">
                    Planning your adventure...
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Finding destinations and organizing activities.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3 animate-pulse">

                <div className="h-4 w-2/3 rounded bg-slate-200" />
                <div className="h-3 w-full rounded bg-slate-100" />
                <div className="h-3 w-5/6 rounded bg-slate-100" />

                <div className="mt-5 rounded-xl border border-slate-100 p-4">
                  <div className="h-4 w-1/3 rounded bg-slate-200" />
                  <div className="mt-3 h-3 w-full rounded bg-slate-100" />
                  <div className="mt-2 h-3 w-4/5 rounded bg-slate-100" />
                </div>

              </div>

              <p className="mt-4 text-center text-xs text-slate-400">
                This may take a few moments.
              </p>

            </div>
          )}


          {/* Error state */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-left sm:mt-8 sm:p-5">

              <div className="flex items-start gap-2 font-semibold text-red-700">
                <AlertCircle className="mt-0.5 shrink-0" size={19} />
                <span>Unable to generate your itinerary</span>
              </div>

              <p className="mt-2 break-words text-sm leading-6 text-red-600">
                {error}
              </p>

              <button
                onClick={() => generate(description.trim())}
                disabled={loading}
                className="mt-4 min-h-10 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                Try again
              </button>

            </div>
          )}

        </div>

        {/* Feature highlights */}
        {!itinerary && !loading && !error && (
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-3 sm:gap-5">

            <Feature
              icon={<MapPin size={22} />}
              title="Smart destinations"
              description="Get a structured list of places to explore."
            />

            <Feature
              icon={<CalendarDays size={22} />}
              title="Day-wise planning"
              description="Organize your activities across each day."
            />

            <Feature
              icon={<Wallet size={22} />}
              title="Budget estimates"
              description="Get an estimated trip budget."
            />

          </div>
        )}

        {/* Saved trips */}
        
        {savedTripsLoading ? (
          <section className="mx-auto mt-10 max-w-4xl sm:mt-14">
            <p className="text-sm text-slate-500">
              Loading your saved trips...
            </p>
          </section>
        ) : savedTripsError ? (
          <section className="mx-auto mt-10 max-w-4xl sm:mt-14">
            <p className="text-sm text-red-500">
              {savedTripsError}
            </p>
          </section>
        ) : savedTrips.length > 0 ? (
          <section className="mx-auto mt-10 max-w-4xl sm:mt-14">

            {/* KEEP YOUR EXISTING SAVED TRIPS SECTION HERE */}
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <FolderOpen className="text-indigo-600" size={22} />

              <h2 className="text-lg font-bold sm:text-xl">
                Your saved trips
              </h2>

              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
                {savedTrips.length}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              {savedTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
                >

                  <h3 className="break-words font-bold text-slate-800">
                    {trip.itinerary.tripTitle}
                  </h3>

                  <p className="mt-2 break-words text-sm text-slate-500">
                    {trip.itinerary.destination}
                    {' · '}
                    {trip.itinerary.duration} days
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    Saved on{' '}
                    {new Date(trip.savedAt).toLocaleDateString()}
                  </p>

                  <div className="mt-4 flex items-center gap-2">

                    <button
                      onClick={() => handleLoadTrip(trip)}
                      className="flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100"
                    >
                      <FolderOpen size={16} className="shrink-0" />
                      Open trip
                    </button>

                    <button
                      onClick={() => handleDeleteTrip(trip.id)}
                      className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border border-red-100 p-2 text-red-500 transition hover:bg-red-50"
                      title="Delete saved trip"
                      aria-label="Delete saved trip"
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>

                </div>
              ))}

            </div>
          </section>
        ) : null}


        {/* Generated itinerary */}
        {itinerary && (
          <>

            <div className="mx-auto mt-8 flex max-w-4xl flex-col gap-3 sm:mt-12 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">

              <h2 className="text-xl font-bold sm:text-2xl">
                Your itinerary
              </h2>

              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">

                <button
                  onClick={handleSaveTrip}
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 sm:w-auto"
                >
                  <Bookmark size={16} />
                  Save itinerary
                </button>

                <button
                  onClick={() => {
                    setItinerary(null)
                    setDescription('')
                  }}
                  className="min-h-11 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-white sm:w-auto"
                >
                  Plan another trip
                </button>

              </div>

            </div>

            <Itinerary
              itinerary={itinerary}
              onRemoveStop={handleRemoveStop}
              onMoveStop={handleMoveStop}
            />

          </>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-8 border-t border-slate-200 bg-white px-4 py-5 text-center text-xs text-slate-500 sm:mt-12 sm:py-6 sm:text-sm">
        <p className="font-medium">WanderWise</p>
        <p className="mt-1">Explore more, plan smarter.</p>
      </footer>

        <Toast
          toast={toast}
          onClose={closeToast}
        />
    </div>
    
  )
}

function Feature({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-md sm:p-6">

      <div className="mb-4 inline-flex rounded-xl bg-indigo-50 p-3 text-indigo-600">
        {icon}
      </div>

      <h3 className="font-semibold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  )
}

export default App
