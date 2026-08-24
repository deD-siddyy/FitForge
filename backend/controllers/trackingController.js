const mongoose = require('mongoose');
const Workout   = require('../models/Workout');
const Nutrition = require('../models/Nutrition');
const Water     = require('../models/Water');
const Weight    = require('../models/Weight');

// ─── Helper ──────────────────────────────────────────────
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};
const endOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

// ═══════════════════════════════════════════════════════════
// WORKOUT
// ═══════════════════════════════════════════════════════════

// @desc  Create workout entry
// @route POST /api/tracking/workout
// @access Private
const createWorkout = async (req, res, next) => {
  try {
    const { date, workoutType, duration, exercises, caloriesBurned, notes } = req.body;

    const workout = await Workout.create({
      user: req.user._id,
      date: date || Date.now(),
      workoutType,
      duration,
      exercises: exercises || [],
      caloriesBurned: caloriesBurned || 0,
      notes,
    });

    res.status(201).json({ success: true, data: workout });
  } catch (error) {
    next(error);
  }
};

// @desc  Get all workouts for current user (optional ?date=YYYY-MM-DD filter)
// @route GET /api/tracking/workout
// @access Private
const getWorkouts = async (req, res, next) => {
  try {
    const filter = { user: req.user._id };

    if (req.query.date) {
      const qd = new Date(req.query.date);
      filter.date = { $gte: startOfDay(qd), $lte: endOfDay(qd) };
    }

    const workouts = await Workout.find(filter).sort({ date: -1 });
    res.status(200).json({ success: true, count: workouts.length, data: workouts });
  } catch (error) {
    next(error);
  }
};

// @desc  Update a workout
// @route PUT /api/tracking/workout/:id
// @access Private
const updateWorkout = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid workout ID' });
    }

    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }
    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this workout' });
    }

    const allowed = ['date', 'workoutType', 'duration', 'exercises', 'caloriesBurned', 'notes'];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const updated = await Workout.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc  Delete a workout
// @route DELETE /api/tracking/workout/:id
// @access Private
const deleteWorkout = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid workout ID' });
    }

    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }
    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this workout' });
    }

    await Workout.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Workout deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ═══════════════════════════════════════════════════════════
// NUTRITION
// ═══════════════════════════════════════════════════════════

// @desc  Log a nutrition entry
// @route POST /api/tracking/nutrition
// @access Private
const createNutrition = async (req, res, next) => {
  try {
    const { date, foodName, mealType, calories, protein, carbs, fats } = req.body;

    const entry = await Nutrition.create({
      user: req.user._id,
      date: date || Date.now(),
      foodName,
      mealType,
      calories,
      protein: protein || 0,
      carbs:   carbs   || 0,
      fats:    fats    || 0,
    });

    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    next(error);
  }
};

// @desc  Get nutrition diary (optional ?date=YYYY-MM-DD)
// @route GET /api/tracking/nutrition
// @access Private
const getNutrition = async (req, res, next) => {
  try {
    const filter = { user: req.user._id };

    if (req.query.date) {
      const qd = new Date(req.query.date);
      filter.date = { $gte: startOfDay(qd), $lte: endOfDay(qd) };
    }

    const entries = await Nutrition.find(filter).sort({ date: -1 });

    // Aggregate totals
    const totals = entries.reduce(
      (acc, e) => ({
        calories: acc.calories + e.calories,
        protein:  acc.protein  + e.protein,
        carbs:    acc.carbs    + e.carbs,
        fats:     acc.fats     + e.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    res.status(200).json({ success: true, count: entries.length, totals, data: entries });
  } catch (error) {
    next(error);
  }
};

// @desc  Update a nutrition entry
// @route PUT /api/tracking/nutrition/:id
// @access Private
const updateNutrition = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid nutrition entry ID' });
    }

    const entry = await Nutrition.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Nutrition entry not found' });
    }
    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this entry' });
    }

    const allowed = ['date', 'foodName', 'mealType', 'calories', 'protein', 'carbs', 'fats'];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const updated = await Nutrition.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc  Delete a nutrition entry
// @route DELETE /api/tracking/nutrition/:id
// @access Private
const deleteNutrition = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid nutrition entry ID' });
    }

    const entry = await Nutrition.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Nutrition entry not found' });
    }
    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this entry' });
    }

    await Nutrition.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Nutrition entry deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ═══════════════════════════════════════════════════════════
// WATER
// ═══════════════════════════════════════════════════════════

// @desc  Log water intake
// @route POST /api/tracking/water
// @access Private
const createWater = async (req, res, next) => {
  try {
    const { date, amountMl } = req.body;

    const entry = await Water.create({
      user: req.user._id,
      date: date || Date.now(),
      amountMl,
    });

    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    next(error);
  }
};

// @desc  Get water intake history (optional ?date=YYYY-MM-DD)
// @route GET /api/tracking/water
// @access Private
const getWater = async (req, res, next) => {
  try {
    const filter = { user: req.user._id };

    if (req.query.date) {
      const qd = new Date(req.query.date);
      filter.date = { $gte: startOfDay(qd), $lte: endOfDay(qd) };
    }

    const entries = await Water.find(filter).sort({ date: -1 });
    const totalMl = entries.reduce((sum, e) => sum + e.amountMl, 0);

    res.status(200).json({ success: true, count: entries.length, totalMl, data: entries });
  } catch (error) {
    next(error);
  }
};

// ═══════════════════════════════════════════════════════════
// WEIGHT
// ═══════════════════════════════════════════════════════════

// @desc  Log weight
// @route POST /api/tracking/weight
// @access Private
const createWeight = async (req, res, next) => {
  try {
    const { date, weight } = req.body;

    const entry = await Weight.create({
      user: req.user._id,
      date: date || Date.now(),
      weight,
    });

    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    next(error);
  }
};

// @desc  Get weight history
// @route GET /api/tracking/weight
// @access Private
const getWeight = async (req, res, next) => {
  try {
    const entries = await Weight.find({ user: req.user._id }).sort({ date: -1 });
    res.status(200).json({ success: true, count: entries.length, data: entries });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createWorkout,  getWorkouts,   updateWorkout,  deleteWorkout,
  createNutrition, getNutrition, updateNutrition, deleteNutrition,
  createWater,    getWater,
  createWeight,   getWeight,
};
