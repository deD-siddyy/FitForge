const express = require('express');
const router = express.Router();
const {
  createAssessment,
  getAssessment,
  updateAssessment,
  getRecommendation,
} = require('../controllers/fitnessController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.route('/assessment')
  .post(protect, createAssessment)
  .get(protect, getAssessment)
  .put(protect, updateAssessment);

router.route('/recommendation')
  .get(protect, getRecommendation);

module.exports = router;
