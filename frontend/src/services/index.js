import API from './api';

// ── Authentication ───────────────────────────────────────────
export const authService = {
  register: (data)  => API.post('/auth/register', data),
  login:    (data)  => API.post('/auth/login', data),
  profile:  ()      => API.get('/auth/profile'),
};

// ── Fitness Assessment ───────────────────────────────────────
export const fitnessService = {
  create:            (data) => API.post('/fitness/assessment', data),
  get:               ()     => API.get('/fitness/assessment'),
  update:            (data) => API.put('/fitness/assessment', data),
  getRecommendation: ()     => API.get('/fitness/recommendation'),
};

// ── Tracking ─────────────────────────────────────────────────
export const trackingService = {
  // Workout
  createWorkout:   (data)     => API.post('/tracking/workout', data),
  getWorkouts:     (date)     => API.get('/tracking/workout', { params: date ? { date } : {} }),
  updateWorkout:   (id, data) => API.put(`/tracking/workout/${id}`, data),
  deleteWorkout:   (id)       => API.delete(`/tracking/workout/${id}`),

  // Nutrition
  createNutrition: (data)     => API.post('/tracking/nutrition', data),
  getNutrition:    (date)     => API.get('/tracking/nutrition', { params: date ? { date } : {} }),
  updateNutrition: (id, data) => API.put(`/tracking/nutrition/${id}`, data),
  deleteNutrition: (id)       => API.delete(`/tracking/nutrition/${id}`),

  // Water
  createWater:     (data)     => API.post('/tracking/water', data),
  getWater:        (date)     => API.get('/tracking/water', { params: date ? { date } : {} }),

  // Weight
  createWeight:    (data)     => API.post('/tracking/weight', data),
  getWeight:       ()         => API.get('/tracking/weight'),
};

// ── Dashboard ────────────────────────────────────────────────
export const dashboardService = {
  get: () => API.get('/dashboard'),
};
