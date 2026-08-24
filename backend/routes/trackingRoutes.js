const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createWorkout,  getWorkouts,   updateWorkout,  deleteWorkout,
  createNutrition, getNutrition, updateNutrition, deleteNutrition,
  createWater,    getWater,
  createWeight,   getWeight,
} = require('../controllers/trackingController');

// ── Workout ────────────────────────────────────────────────
router.route('/workout')
  .post(protect, createWorkout)
  .get(protect, getWorkouts);

router.route('/workout/:id')
  .put(protect, updateWorkout)
  .delete(protect, deleteWorkout);

// ── Nutrition ──────────────────────────────────────────────
router.route('/nutrition')
  .post(protect, createNutrition)
  .get(protect, getNutrition);

router.route('/nutrition/:id')
  .put(protect, updateNutrition)
  .delete(protect, deleteNutrition);

// ── Water ──────────────────────────────────────────────────
router.route('/water')
  .post(protect, createWater)
  .get(protect, getWater);

// ── Weight ─────────────────────────────────────────────────
router.route('/weight')
  .post(protect, createWeight)
  .get(protect, getWeight);

module.exports = router;
