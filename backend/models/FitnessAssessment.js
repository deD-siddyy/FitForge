const mongoose = require('mongoose');

const fitnessAssessmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [10, 'Age must be at least 10'],
      max: [100, 'Age must be 100 or below'],
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: {
        values: ['male', 'female'],
        message: 'Gender must be male or female',
      },
    },
    height: {
      type: Number,
      required: [true, 'Height is required'],
      min: [50, 'Height must be at least 50 cm'],
      max: [300, 'Height must be 300 cm or below'],
    },
    weight: {
      type: Number,
      required: [true, 'Weight is required'],
      min: [10, 'Weight must be at least 10 kg'],
      max: [500, 'Weight must be 500 kg or below'],
    },
    goal: {
      type: String,
      required: [true, 'Goal is required'],
      enum: {
        values: ['weight_loss', 'muscle_gain', 'maintenance'],
        message: 'Goal must be weight_loss, muscle_gain, or maintenance',
      },
    },
    activityLevel: {
      type: String,
      required: [true, 'Activity level is required'],
      enum: {
        values: ['sedentary', 'lightly_active', 'moderately_active', 'very_active'],
        message: 'activityLevel must be sedentary, lightly_active, moderately_active, or very_active',
      },
    },
    workoutExperience: {
      type: String,
      required: [true, 'Workout experience is required'],
      enum: {
        values: ['beginner', 'intermediate', 'advanced'],
        message: 'workoutExperience must be beginner, intermediate, or advanced',
      },
    },


    bmi: { type: Number },
    bmr: { type: Number },
    dailyCalorieTarget: { type: Number },


    workoutRecommendation: { type: Object },
    dietRecommendation: { type: Object },
  },
  { timestamps: true }
);

const FitnessAssessment = mongoose.model('FitnessAssessment', fitnessAssessmentSchema);
module.exports = FitnessAssessment;
