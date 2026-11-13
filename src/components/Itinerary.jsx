
import { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Wallet,
  Lightbulb,
  Trash2,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'

function StopCard({
  stop,
  index,
  totalStops,
  onRemove,
  onMove,
}) {
  const [expanded, setExpanded] = useState(true)

  const formattedCost = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(stop.estimatedCost ?? 0)

  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md sm:p-4">

      {/* Stop heading */}
      <div className="flex items-start justify-between gap-2 sm:gap-3">

        <div className="flex min-w-0 flex-1 items-start gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 font-semibold text-indigo-600">
            {index + 1}
          </div>

          <div className="min-w-0 flex-1">

            <h4 className="break-words text-sm font-semibold leading-6 text-slate-800 sm:text-base">
              {stop.name}
            </h4>

            <span className="mt-1 inline-block max-w-full break-words rounded-full bg-indigo-50 px-2 py-1 text-xs text-indigo-600">
              {stop.category}
            </span>

          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          aria-label={expanded ? 'Collapse stop' : 'Expand stop'}
          aria-expanded={expanded}
        >
          {expanded
            ? <ChevronUp size={19} />
            : <ChevronDown size={19} />
          }
        </button>

      </div>

      {/* Expanded stop details */}
      {expanded && (
        <div className="mt-4 space-y-4">

          <p className="break-words text-sm leading-6 text-slate-600">
            {stop.description}
          </p>

          {/* Stop information */}
          <div className="grid grid-cols-1 gap-3 text-sm text-slate-600 sm:grid-cols-2">

            <div className="flex min-w-0 items-start gap-2">
              <MapPin
                size={17}
                className="mt-0.5 shrink-0 text-indigo-500"
              />
              <span className="break-words">{stop.location}</span>
            </div>

            <div className="flex min-w-0 items-start gap-2">
              <Clock
                size={17}
                className="mt-0.5 shrink-0 text-indigo-500"
              />
              <span className="break-words">
                {stop.estimatedDuration}
              </span>
            </div>

            <div className="flex min-w-0 items-start gap-2">
              <Wallet
                size={17}
                className="mt-0.5 shrink-0 text-indigo-500"
              />
              <span className="break-words tabular-nums">
                {formattedCost}
              </span>
            </div>

          </div>

          {/* Travel tip */}
          {stop.tips && (
            <div className="rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-800">

              <div className="mb-1 flex items-center gap-2 font-semibold">
                <Lightbulb size={17} className="shrink-0" />
                Travel tip
              </div>

              <p className="break-words">
                {stop.tips}
              </p>

            </div>
          )}

        </div>
      )}

      {/* Stop management actions */}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">

        <span className="text-xs text-slate-400">
          Stop {index + 1} of {totalStops}
        </span>

        <div className="flex items-center gap-1.5">

          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Move stop up"
            title="Move up"
          >
            <ArrowUp size={18} />
          </button>

          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={index === totalStops - 1}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Move stop down"
            title="Move down"
          >
            <ArrowDown size={18} />
          </button>

          <button
            type="button"
            onClick={onRemove}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300"
            aria-label="Remove stop"
            title="Remove stop"
          >
            <Trash2 size={18} />
          </button>

        </div>

      </div>

    </div>
  )
}

function DayCard({
  day,
  dayIndex,
  onRemoveStop,
  onMoveStop,
}) {
  const [expanded, setExpanded] = useState(true)

  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-5 md:p-6">

      {/* Day heading */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between gap-3 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
        aria-expanded={expanded}
      >

        <div className="min-w-0 flex-1">

          <p className="text-xs font-semibold tracking-wide text-indigo-600 sm:text-sm">
            DAY {day.day}
          </p>

          <h3 className="mt-1 break-words text-base font-bold leading-6 text-slate-800 sm:text-lg">
            {day.title}
          </h3>

          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            {day.stops.length} stops
          </p>

        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white">
          {expanded
            ? <ChevronUp size={21} />
            : <ChevronDown size={21} />
          }
        </div>

      </button>

      {/* Day stops */}
      {expanded && (
        <div className="mt-4 space-y-3 sm:mt-5">

          {day.stops.length === 0 ? (

            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-5 text-center">

              <p className="text-sm text-slate-500">
                No stops remaining for this day.
              </p>

            </div>

          ) : (

            day.stops.map((stop, stopIndex) => (
              <StopCard
                key={stop.id || `${day.day}-${stopIndex}`}
                stop={stop}
                index={stopIndex}
                totalStops={day.stops.length}
                onRemove={() => onRemoveStop(dayIndex, stop.id)}
                onMove={(direction) =>
                  onMoveStop(dayIndex, stopIndex, direction)
                }
              />
            ))

          )}

        </div>
      )}

    </section>
  )
}

export default function Itinerary({
  itinerary,
  onRemoveStop,
  onMoveStop,
}) {

  const formatBudget = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: itinerary.currency || 'INR',
    maximumFractionDigits: 0,
  }).format(itinerary.totalEstimatedBudget ?? 0)

  return (
    <div className="mx-auto mt-7 w-full max-w-4xl space-y-5 sm:mt-10 sm:space-y-6">

      {/* Trip summary */}
      <div className="min-w-0 overflow-hidden rounded-2xl bg-indigo-600 p-4 text-white shadow-lg shadow-indigo-200/50 sm:p-6 md:p-8">

        <p className="text-xs font-medium tracking-wider text-indigo-200 sm:text-sm">
          YOUR AI-GENERATED TRIP
        </p>

        <h2 className="mt-2 break-words text-2xl font-bold leading-tight sm:text-3xl">
          {itinerary.tripTitle}
        </h2>

        {/* Trip information */}
        <div className="mt-5 grid grid-cols-1 gap-4 text-sm text-indigo-100 sm:grid-cols-2 md:grid-cols-3">

          <div className="flex min-w-0 items-start gap-2">
            <MapPin size={18} className="mt-0.5 shrink-0" />
            <span className="break-words">
              {itinerary.destination}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock size={18} className="shrink-0" />
            <span>{itinerary.duration} days</span>
          </div>

          <div className="flex min-w-0 items-center gap-2">
            <Wallet size={18} className="shrink-0" />
            <span className="break-words font-medium tabular-nums">
              {formatBudget}
            </span>
          </div>

        </div>

        <div className="mt-5 border-t border-indigo-400/30 pt-3">
          <p className="text-xs leading-5 text-indigo-200">
            Estimated budget, not a live price quotation.
          </p>
        </div>

      </div>

      {/* Day-wise itinerary */}
      <div className="space-y-4 sm:space-y-5">

        {itinerary.days.map((day, dayIndex) => (
          <DayCard
            key={day.day}
            day={day}
            dayIndex={dayIndex}
            onRemoveStop={onRemoveStop}
            onMoveStop={onMoveStop}
          />
        ))}

      </div>

    </div>
  )
}
