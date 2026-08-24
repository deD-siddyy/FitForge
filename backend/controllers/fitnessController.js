const FitnessAssessment = require('../models/FitnessAssessment');
const {
  calculateBMI,
  calculateBMR,
  calculateDailyCalories,
  getWorkoutRecommendation,
  getDietRecommendation,
} = require('../utils/fitnessService');

// ─────────────────────────────────────────────────────────
// Helper: run all calculations and build recommendation objects
// ─────────────────────────────────────────────────────────
const computeAssessment = (data) => {
  const { weight, height, age, gender, activityLevel, goal, workoutExperience } = data;

  const bmi                = calculateBMI(weight, height);
  const bmr                = calculateBMR(weight, height, age, gender);
  const dailyCalorieTarget = calculateDailyCalories(bmr, activityLevel, goal);
  const workoutRecommendation = getWorkoutRecommendation(goal, workoutExperience, activityLevel);
  const dietRecommendation    = getDietRecommendation(goal, dailyCalorieTarget);

  return { bmi, bmr, dailyCalorieTarget, workoutRecommendation, dietRecommendation };
};

// ─────────────────────────────────────────────────────────
// @desc    Create a new fitness assessment
// @route   POST /api/fitness/assessment
// @access  Private
// ─────────────────────────────────────────────────────────
const createAssessment = async (req, res, next) => {
  try {
    const { age, gender, height, weight, goal, activityLevel, workoutExperience } = req.body;

    // Check: does user already have an assessment?
    const existing = await FitnessAssessment.findOne({ user: req.user._id });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Assessment already exists. Use PUT /api/fitness/assessment to update it.',
      });
    }

    // Run all backend calculations — never trust client-sent BMI/BMR/calories
    const computed = computeAssessment({ age, gender, height, weight, goal, activityLevel, workoutExperience });

    const assessment = await FitnessAssessment.create({
      user: req.user._id,
      age,
      gender,
      height,
      weight,
      goal,
      activityLevel,
      workoutExperience,
      ...computed,
    });

    res.status(201).json({ success: true, data: assessment });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get current user's fitness assessment
// @route   GET /api/fitness/assessment
// @access  Private
// ─────────────────────────────────────────────────────────
const getAssessment = async (req, res, next) => {
  try {
    const assessment = await FitnessAssessment.findOne({ user: req.user._id });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'No fitness assessment found. Please create one via POST /api/fitness/assessment.',
      });
    }

    res.status(200).json({ success: true, data: assessment });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Update the current user's fitness assessment
// @route   PUT /api/fitness/assessment
// @access  Private
// ─────────────────────────────────────────────────────────
const updateAssessment = async (req, res, next) => {
  try {
    const assessment = await FitnessAssessment.findOne({ user: req.user._id });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'No fitness assessment found. Please create one via POST /api/fitness/assessment.',
      });
    }

    // Merge existing fields with updates — so partial updates work
    const merged = {
      age:               req.body.age               ?? assessment.age,
      gender:            req.body.gender            ?? assessment.gender,
      height:            req.body.height            ?? assessment.height,
      weight:            req.body.weight            ?? assessment.weight,
      goal:              req.body.goal              ?? assessment.goal,
      activityLevel:     req.body.activityLevel     ?? assessment.activityLevel,
      workoutExperience: req.body.workoutExperience ?? assessment.workoutExperience,
    };

    // Re-compute everything from the merged data
    const computed = computeAssessment(merged);

    const updated = await FitnessAssessment.findOneAndUpdate(
      { user: req.user._id },
      { ...merged, ...computed },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get recommendation summary (shorthand read-only)
// @route   GET /api/fitness/recommendation
// @access  Private
// ─────────────────────────────────────────────────────────
const getRecommendation = async (req, res, next) => {
  try {
    const assessment = await FitnessAssessment.findOne({ user: req.user._id });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'No fitness assessment found. Please create one first.',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        bmi:                  assessment.bmi,
        bmr:                  assessment.bmr,
        dailyCalorieTarget:   assessment.dailyCalorieTarget,
        goal:                 assessment.goal,
        workoutRecommendation: assessment.workoutRecommendation,
        dietRecommendation:   assessment.dietRecommendation,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createAssessment, getAssessment, updateAssessment, getRecommendation };
