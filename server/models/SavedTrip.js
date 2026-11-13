
import mongoose from 'mongoose'

const savedTripSchema = new mongoose.Schema({
  ownerId: {
    type: String,
    required: true,
    index: true,
  },

  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },

  itinerary: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },

  // Used to make migration of existing local trips safe.
  legacyId: {
    type: String,
    default: null,
  },

  savedAt: {
    type: Date,
    default: Date.now,
  },
})

// Avoid importing the same model multiple times.
const SavedTrip =
  mongoose.models.SavedTrip ||
  mongoose.model('SavedTrip', savedTripSchema)

export default SavedTrip
