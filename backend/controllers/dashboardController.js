const Workout   = require('../models/Workout');
const Nutrition = require('../models/Nutrition');
const Water     = require('../models/Water');
const Weight    = require('../models/Weight');

// ─── Date helpers ─────────────────────────────────────────
const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0);       return x; };
const endOfDay   = (d) => { const x = new Date(d); x.setHours(23, 59, 59, 999);   return x; };
const daysAgo    = (n) => { const x = new Date(); x.setDate(x.getDate() - n);     return x; };

// ─────────────────────────────────────────────────────────
// @desc  Get user dashboard — today's stats + 7-day history
// @route GET /api/dashboard
// @access Private
// ─────────────────────────────────────────────────────────
const getDashboard = async (req, res, next) => {
  try {
    const userId  = req.user._id;
    const today   = new Date();
    const todayStart = startOfDay(today);
    const todayEnd   = endOfDay(today);

    // ── TODAY'S DATA ──────────────────────────────────────

    // Today's nutrition — calories + macros
    const todayNutrition = await Nutrition.find({
      user: userId,
      date: { $gte: todayStart, $lte: todayEnd },
    });

    const todayCalories = todayNutrition.reduce((s, e) => s + e.calories, 0);
    const todayProtein  = todayNutrition.reduce((s, e) => s + e.protein,  0);
    const todayCarbs    = todayNutrition.reduce((s, e) => s + e.carbs,    0);
    const todayFats     = todayNutrition.reduce((s, e) => s + e.fats,     0);

    // Today's water
    const todayWater = await Water.find({
      user: userId,
      date: { $gte: todayStart, $lte: todayEnd },
    });
    const todayWaterMl = todayWater.reduce((s, e) => s + e.amountMl, 0);

    // Today's workouts
    const todayWorkouts = await Workout.find({
      user: userId,
      date: { $gte: todayStart, $lte: todayEnd },
    });
    const todayCaloriesBurned = todayWorkouts.reduce((s, w) => s + w.caloriesBurned, 0);

    // Latest weight entry
    const latestWeight = await Weight.findOne({ user: userId }).sort({ date: -1 });

    // ── LAST 7 DAYS ───────────────────────────────────────
    const weekStart = startOfDay(daysAgo(6)); // 6 days ago = 7-day window

    // Weight history
    const weeklyWeights = await Weight.find({
      user: userId,
      date: { $gte: weekStart, $lte: todayEnd },
    }).sort({ date: 1 });

    // Calorie trend — group by day
    const weeklyNutrition = await Nutrition.find({
      user: userId,
      date: { $gte: weekStart, $lte: todayEnd },
    }).sort({ date: 1 });

    // Build daily calorie map (last 7 days)
    const calorieTrendMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = daysAgo(i);
      const key = d.toISOString().split('T')[0];
      calorieTrendMap[key] = 0;
    }
    weeklyNutrition.forEach(e => {
      const key = new Date(e.date).toISOString().split('T')[0];
      if (calorieTrendMap[key] !== undefined) {
        calorieTrendMap[key] += e.calories;
      }
    });
    const calorieTrend = Object.entries(calorieTrendMap).map(([date, calories]) => ({ date, calories }));

    // Weekly workout count
    const weeklyWorkoutCount = await Workout.countDocuments({
      user: userId,
      date: { $gte: weekStart, $lte: todayEnd },
    });

    // Weekly water intake trend
    const weeklyWater = await Water.find({
      user: userId,
      date: { $gte: weekStart, $lte: todayEnd },
    }).sort({ date: 1 });

    const waterTrendMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = daysAgo(i);
      const key = d.toISOString().split('T')[0];
      waterTrendMap[key] = 0;
    }
    weeklyWater.forEach(e => {
      const key = new Date(e.date).toISOString().split('T')[0];
      if (waterTrendMap[key] !== undefined) {
        waterTrendMap[key] += e.amountMl;
      }
    });
    const waterTrend = Object.entries(waterTrendMap).map(([date, ml]) => ({ date, ml }));

    // ── RESPONSE ─────────────────────────────────────────
    res.status(200).json({
      success: true,
      data: {
        today: {
          date: today.toISOString().split('T')[0],
          nutrition: {
            calories:      todayCalories,
            protein:       todayProtein,
            carbs:         todayCarbs,
            fats:          todayFats,
            entries:       todayNutrition.length,
          },
          water: {
            totalMl:       todayWaterMl,
            entries:       todayWater.length,
          },
          workout: {
            completed:     todayWorkouts.length > 0,
            count:         todayWorkouts.length,
            caloriesBurned: todayCaloriesBurned,
          },
          latestWeight:    latestWeight ? latestWeight.weight : null,
        },
        weekly: {
          weightHistory:   weeklyWeights.map(w => ({
            date:   new Date(w.date).toISOString().split('T')[0],
            weight: w.weight,
          })),
          calorieTrend,
          waterTrend,
          workoutCount:   weeklyWorkoutCount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard };
