const FitnessAssessment = require('../models/FitnessAssessment');
const {
  calculateBMI,
  calculateBMR,
  calculateDailyCalories,
  getWorkoutRecommendation,
  getDietRecommendation,
} = require('../utils/fitnessService');

const computeAssessment = (data) => {
  const { weight, height, age, gender, activityLevel, goal, workoutExperience } = data;

  const bmi                = calculateBMI(weight, height);
  const bmr                = calculateBMR(weight, height, age, gender);
  const dailyCalorieTarget = calculateDailyCalories(bmr, activityLevel, goal);
  const workoutRecommendation = getWorkoutRecommendation(goal, workoutExperience, activityLevel);
  const dietRecommendation    = getDietRecommendation(goal, dailyCalorieTarget);

  return { bmi, bmr, dailyCalorieTarget, workoutRecommendation, dietRecommendation };
};


const createAssessment = async (req, res, next) => {
  try {
    const { age, gender, height, weight, goal, activityLevel, workoutExperience } = req.body;


    const existing = await FitnessAssessment.findOne({ user: req.user._id });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Assessment already exists. Use PUT /api/fitness/assessment to update it.',
      });
    }


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


const updateAssessment = async (req, res, next) => {
  try {
    const assessment = await FitnessAssessment.findOne({ user: req.user._id });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'No fitness assessment found. Please create one via POST /api/fitness/assessment.',
      });
    }

    const merged = {
      age:               req.body.age               ?? assessment.age,
      gender:            req.body.gender            ?? assessment.gender,
      height:            req.body.height            ?? assessment.height,
      weight:            req.body.weight            ?? assessment.weight,
      goal:              req.body.goal              ?? assessment.goal,
      activityLevel:     req.body.activityLevel     ?? assessment.activityLevel,
      workoutExperience: req.body.workoutExperience ?? assessment.workoutExperience,
    };


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
