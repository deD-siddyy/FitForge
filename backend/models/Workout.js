const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    workoutType: {
      type: String,
      required: [true, 'Workout type is required'],
      enum: {
        values: ['strength', 'cardio', 'flexibility', 'sports', 'other'],
        message: 'workoutType must be strength, cardio, flexibility, sports, or other',
      },
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
      max: [600, 'Duration cannot exceed 600 minutes'],
    },
    exercises: [
      {
        name:     { type: String, required: true, trim: true },
        sets:     { type: Number, min: 1 },
        reps:     { type: Number, min: 1 },
        weightKg: { type: Number, min: 0 },
        notes:    { type: String, trim: true },
      },
    ],
    caloriesBurned: {
      type: Number,
      min: [0, 'Calories burned cannot be negative'],
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Workout', workoutSchema);
