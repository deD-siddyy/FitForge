const calculateBMI = (weightKg, heightCm) => {
  if (!weightKg || !heightCm) return null;
  const heightM = heightCm / 100;
  return parseFloat((weightKg / (heightM * heightM)).toFixed(2));
};


const calculateBMR = (weightKg, heightCm, age, gender) => {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const bmr = gender === 'male' ? base + 5 : base - 161;
  return parseFloat(bmr.toFixed(2));
};


const ACTIVITY_MULTIPLIERS = {
  sedentary:          1.2,
  lightly_active:     1.375,
  moderately_active:  1.55,
  very_active:        1.725,
};

const GOAL_ADJUSTMENTS = {
  weight_loss:  -500,
  maintenance:     0,
  muscle_gain:  +300,
};

const calculateDailyCalories = (bmr, activityLevel, goal) => {
  const tdee = bmr * ACTIVITY_MULTIPLIERS[activityLevel];
  const target = tdee + GOAL_ADJUSTMENTS[goal];

  return Math.max(1200, parseFloat(target.toFixed(0)));
};


const getWorkoutRecommendation = (goal, workoutExperience, activityLevel) => {
  const key = `${workoutExperience}_${goal}`;

  const plans = {
    beginner_weight_loss: {
      focus: 'Full-body workouts + steady-state cardio',
      weeklyFrequency: '3–4 days/week',
      sessionDuration: '30–45 minutes',
      exercises: [
        'Brisk walking / light jogging (30 min)',
        'Bodyweight squats — 3 × 15',
        'Push-ups (knee or standard) — 3 × 10',
        'Dumbbell rows — 3 × 12',
        'Plank holds — 3 × 30 sec',
        'Glute bridges — 3 × 15',
      ],
      cardio: '20–30 min moderate cardio after each session',
      notes: 'Focus on consistency. Increase intensity gradually each week.',
    },
    beginner_muscle_gain: {
      focus: 'Full-body resistance training with progressive overload',
      weeklyFrequency: '3 days/week',
      sessionDuration: '45–60 minutes',
      exercises: [
        'Goblet squats — 3 × 10',
        'Dumbbell bench press — 3 × 10',
        'Dumbbell rows — 3 × 10 each side',
        'Overhead press — 3 × 10',
        'Romanian deadlifts — 3 × 10',
        'Bicep curls — 3 × 12',
      ],
      cardio: 'Light 10-min warm-up only',
      notes: 'Increase weight every 1–2 weeks. Rest 60–90 seconds between sets.',
    },
    beginner_maintenance: {
      focus: 'Balanced full-body fitness',
      weeklyFrequency: '3 days/week',
      sessionDuration: '30–45 minutes',
      exercises: [
        'Bodyweight squats — 3 × 12',
        'Push-ups — 3 × 10',
        'Dumbbell rows — 3 × 12',
        'Jumping jacks — 3 × 30 sec',
        'Plank — 3 × 30 sec',
      ],
      cardio: '15–20 min light cardio',
      notes: 'Maintain activity and healthy habits.',
    },

    intermediate_weight_loss: {
      focus: 'Resistance training + HIIT cardio',
      weeklyFrequency: '4–5 days/week',
      sessionDuration: '45–60 minutes',
      exercises: [
        'Barbell or dumbbell squats — 4 × 10',
        'Bench press — 4 × 10',
        'Pull-ups / lat pulldown — 4 × 10',
        'Deadlifts — 3 × 8',
        'Cable rows — 3 × 12',
        'HIIT finisher — 15 min',
      ],
      cardio: '15–20 min HIIT (work:rest 1:2 ratio)',
      notes: 'Prioritize compound lifts. Track calories for fat loss.',
    },
    intermediate_muscle_gain: {
      focus: 'Push/Pull/Legs split — structured hypertrophy',
      weeklyFrequency: '5 days/week',
      sessionDuration: '60–75 minutes',
      exercises: [
        'Push day: Bench press, OHP, tricep dips',
        'Pull day: Deadlifts, rows, pull-ups, curls',
        'Leg day: Squats, leg press, Romanian DL, leg curls',
      ],
      cardio: '2 × 20 min light cardio on rest days',
      notes: 'Increase load every 1–2 weeks. Protein 1.6–2.2 g/kg/day.',
    },
    intermediate_maintenance: {
      focus: 'Upper/Lower split with cardio',
      weeklyFrequency: '4 days/week',
      sessionDuration: '45–60 minutes',
      exercises: [
        'Upper: Bench, rows, OHP, curls, triceps',
        'Lower: Squats, RDLs, leg press, calf raises',
      ],
      cardio: '2 × 20–30 min moderate cardio',
      notes: 'Focus on consistency and balanced nutrition.',
    },

    advanced_weight_loss: {
      focus: 'High-volume resistance training + cardio periodisation',
      weeklyFrequency: '5–6 days/week',
      sessionDuration: '60–75 minutes',
      exercises: [
        'Compound lifts (squat, bench, deadlift, OHP) — 5 × 5',
        'Accessory supersets — 4 × 12',
        'HIIT sessions — 20 min × 3/week',
      ],
      cardio: '3 × 20 min HIIT or 4 × 30 min LISS',
      notes: 'Maintain strength while in deficit. Prioritise sleep and recovery.',
    },
    advanced_muscle_gain: {
      focus: 'Advanced PPL / Upper-Lower or specialisation program',
      weeklyFrequency: '5–6 days/week',
      sessionDuration: '75–90 minutes',
      exercises: [
        'Periodised barbell work: heavy & volume days',
        'Specialisation blocks for lagging muscle groups',
        'High weekly volume (15–22 sets per muscle group)',
      ],
      cardio: 'Minimal — 2 × 20 min LISS for cardiovascular health',
      notes: 'Track progressive overload. Deload every 4–6 weeks.',
    },
    advanced_maintenance: {
      focus: 'Strength maintenance with balanced training',
      weeklyFrequency: '4–5 days/week',
      sessionDuration: '60 minutes',
      exercises: [
        'Maintain compound lift strength at 85–90% 1RM',
        'Balanced accessory work',
        '2 × 30 min cardio sessions',
      ],
      cardio: '2–3 × 30 min moderate cardio',
      notes: 'Autoregulate intensity based on recovery.',
    },
  };

  return plans[key] || plans[`${workoutExperience}_maintenance`];
};


const getDietRecommendation = (goal, dailyCalorieTarget) => {
  const base = {
    dailyCalorieTarget,
    mealFrequency: '3 main meals + 1–2 snacks',
    hydration: 'Drink 2.5–3.5 litres of water per day',
  };

  if (goal === 'weight_loss') {
    return {
      ...base,
      strategy: 'Calorie-controlled high-protein diet',
      proteinTarget: '1.8–2.2 g per kg of bodyweight',
      macroGuidance: {
        protein: '35–40% of total calories',
        carbohydrates: '35–40% of total calories (prioritise complex carbs)',
        fats: '20–25% of total calories (unsaturated sources)',
      },
      foodsToInclude: [
        'Lean meats (chicken, turkey, fish)',
        'Eggs and low-fat dairy',
        'Legumes and lentils',
        'Vegetables (non-starchy) in abundance',
        'Fruits (in moderation)',
        'Whole grains (oats, brown rice, quinoa)',
        'Healthy fats (avocado, nuts, olive oil in moderation)',
      ],
      foodsToLimit: [
        'Refined sugars and ultra-processed foods',
        'Fried and high-fat fast food',
        'Sugary beverages',
        'Excess alcohol',
      ],
      mealTimingTip: 'Eat your largest meal around training time. Keep dinner lighter.',
    };
  }

  if (goal === 'muscle_gain') {
    return {
      ...base,
      strategy: 'Calorie surplus with high-protein diet',
      proteinTarget: '1.8–2.4 g per kg of bodyweight',
      macroGuidance: {
        protein: '30–35% of total calories',
        carbohydrates: '45–50% of total calories (fuel for workouts)',
        fats: '20–25% of total calories',
      },
      foodsToInclude: [
        'Lean meats, eggs, fish, dairy',
        'Rice, pasta, oats, sweet potato',
        'Legumes, tofu, paneer',
        'Nuts, seeds, nut butters',
        'Fruits and vegetables for micronutrients',
        'Whole milk, Greek yogurt',
      ],
      foodsToLimit: [
        'Empty-calorie junk food',
        'Excessive sugar',
        'Alcohol (interferes with protein synthesis)',
      ],
      mealTimingTip: 'Eat a protein + carb meal 1–2 hours before and after training.',
    };
  }

  // maintenance
  return {
    ...base,
    strategy: 'Balanced diet matching energy expenditure',
    proteinTarget: '1.4–1.8 g per kg of bodyweight',
    macroGuidance: {
      protein: '25–30% of total calories',
      carbohydrates: '45–50% of total calories',
      fats: '25–30% of total calories',
    },
    foodsToInclude: [
      'Variety of lean proteins',
      'Whole grains and complex carbohydrates',
      'Plenty of vegetables and fruits',
      'Healthy fats',
      'Adequate fibre (25–35 g/day)',
    ],
    foodsToLimit: [
      'Ultra-processed foods',
      'Trans fats',
      'Excessive sodium',
    ],
    mealTimingTip: 'Eat regular balanced meals. Avoid skipping meals.',
  };
};

module.exports = {
  calculateBMI,
  calculateBMR,
  calculateDailyCalories,
  getWorkoutRecommendation,
  getDietRecommendation,
};
