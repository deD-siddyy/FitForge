import { useState, useRef, useEffect } from 'react';
import { useDocumentTitle } from '../hooks';
import { trackingService } from '../services';
import './Tracking.css';

// ─── Exercise Data 
const MUSCLE_GROUPS = [
  { id: 'chest',     label: 'Chest',      image: '/anatomy/chest_muscle.jpg',     workoutType: 'strength' },
  { id: 'back',      label: 'Back',       image: '/anatomy/back_muscle.jpg',      workoutType: 'strength' },
  { id: 'shoulders', label: 'Shoulders',  image: '/anatomy/shoulder_muscle.jpg',  workoutType: 'strength' },
  { id: 'biceps',    label: 'Biceps',     image: '/anatomy/bicep_muscle.jpg',     workoutType: 'strength' },
  { id: 'triceps',   label: 'Triceps',    image: '/anatomy/tricep_muscle.jpg',    workoutType: 'strength' },
  { id: 'legs',      label: 'Legs',       image: '/anatomy/leg_muscle.jpg',       workoutType: 'strength' },
  { id: 'glutes',    label: 'Glutes',     image: '/anatomy/glute_muscle.jpg',     workoutType: 'strength' },
  { id: 'abs',       label: 'Abs / Core', image: '/anatomy/abs_muscle.jpg',       workoutType: 'strength' },
  { id: 'cardio',    label: 'Cardio',     image: '/anatomy/cardio_icon.jpg',      workoutType: 'cardio'   },
  { id: 'fullbody',  label: 'Full Body',  image: '/anatomy/full_body_muscle.jpg', workoutType: 'strength' },
];

const EXERCISES = {
  chest:     ['Bench Press', 'Incline Bench Press', 'Dumbbell Bench Press', 'Incline Dumbbell Press', 'Chest Fly', 'Cable Crossover', 'Push Ups'],
  back:      ['Lat Pulldown', 'Pull Ups', 'Barbell Row', 'Seated Cable Row', 'Dumbbell Row', 'T-Bar Row', 'Deadlift'],
  shoulders: ['Overhead Press', 'Dumbbell Shoulder Press', 'Lateral Raise', 'Front Raise', 'Rear Delt Fly', 'Face Pull'],
  biceps:    ['Barbell Curl', 'Dumbbell Curl', 'Hammer Curl', 'Preacher Curl', 'Cable Curl'],
  triceps:   ['Tricep Pushdown', 'Overhead Tricep Extension', 'Skull Crushers', 'Dips', 'Close Grip Bench Press'],
  legs:      ['Squat', 'Leg Press', 'Leg Extension', 'Leg Curl', 'Romanian Deadlift', 'Lunges', 'Calf Raises'],
  glutes:    ['Hip Thrust', 'Glute Bridge', 'Bulgarian Split Squat', 'Cable Kickback', 'Sumo Squat'],
  abs:       ['Crunches', 'Leg Raises', 'Plank', 'Russian Twist', 'Cable Crunch', 'Mountain Climbers', 'Bicycle Crunches'],
  cardio:    ['Treadmill', 'Running', 'Cycling', 'Cross Trainer', 'Stair Climber', 'Jump Rope', 'Swimming'],
  fullbody:  ['Deadlift', 'Clean and Press', 'Burpees', 'Kettlebell Swings', 'Thrusters', 'Box Jumps'],
};

// ─── Food Data 
const FOOD_DB = [
  { name: 'Chicken Breast',    calories: 165, protein: 31, carbs: 0,  fats: 3.6, per: '100g' },
  { name: 'Chicken Thigh',     calories: 209, protein: 26, carbs: 0,  fats: 11,  per: '100g' },
  { name: 'Chicken Curry',     calories: 180, protein: 20, carbs: 10, fats: 7,   per: '100g' },
  { name: 'White Rice',        calories: 130, protein: 2.7,carbs: 28, fats: 0.3, per: '100g' },
  { name: 'Brown Rice',        calories: 111, protein: 2.6,carbs: 23, fats: 0.9, per: '100g' },
  { name: 'Basmati Rice',      calories: 121, protein: 3.5,carbs: 25, fats: 0.4, per: '100g' },
  { name: 'Whole Egg',         calories: 155, protein: 13, carbs: 1.1,fats: 11,  per: '100g' },
  { name: 'Egg White',         calories: 52,  protein: 11, carbs: 0.7,fats: 0.2, per: '100g' },
  { name: 'Boiled Egg',        calories: 155, protein: 13, carbs: 1.1,fats: 11,  per: '100g' },
  { name: 'Oats',              calories: 389, protein: 17, carbs: 66, fats: 7,   per: '100g' },
  { name: 'Rolled Oats',       calories: 379, protein: 13, carbs: 68, fats: 6.5, per: '100g' },
  { name: 'Banana',            calories: 89,  protein: 1.1,carbs: 23, fats: 0.3, per: '100g' },
  { name: 'Peanut Butter',     calories: 588, protein: 25, carbs: 20, fats: 50,  per: '100g' },
  { name: 'Peanuts',           calories: 567, protein: 26, carbs: 16, fats: 49,  per: '100g' },
  { name: 'Paneer',            calories: 265, protein: 18, carbs: 3.4,fats: 20,  per: '100g' },
  { name: 'Greek Yogurt',      calories: 59,  protein: 10, carbs: 3.6,fats: 0.4, per: '100g' },
  { name: 'Sweet Potato',      calories: 86,  protein: 1.6,carbs: 20, fats: 0.1, per: '100g' },
  { name: 'Broccoli',          calories: 34,  protein: 2.8,carbs: 7,  fats: 0.4, per: '100g' },
  { name: 'Spinach',           calories: 23,  protein: 2.9,carbs: 3.6,fats: 0.4, per: '100g' },
  { name: 'Salmon',            calories: 208, protein: 20, carbs: 0,  fats: 13,  per: '100g' },
  { name: 'Tuna',              calories: 132, protein: 29, carbs: 0,  fats: 1,   per: '100g' },
  { name: 'Almonds',           calories: 579, protein: 21, carbs: 22, fats: 50,  per: '100g' },
  { name: 'Milk (Full Fat)',   calories: 61,  protein: 3.2,carbs: 4.8,fats: 3.3, per: '100ml'},
  { name: 'Curd / Dahi',       calories: 98,  protein: 3.1,carbs: 3.4,fats: 4.3, per: '100g' },
  { name: 'Dal / Lentils',     calories: 116, protein: 9,  carbs: 20, fats: 0.4, per: '100g' },
  { name: 'Chapati / Roti',    calories: 297, protein: 9.1,carbs: 57, fats: 3.8, per: '100g' },
  { name: 'Whey Protein',      calories: 400, protein: 80, carbs: 10, fats: 5,   per: '100g' },
];

// ─── Helpers
const DEFAULT_EXERCISE = {
  name: '', muscleGroup: '', sets: '', reps: '', weightKg: '', duration: '', notes: '',
};
const DEFAULT_NUTRITION = {
  foodName: '', mealType: 'lunch', quantity: '', calories: '', protein: '', carbs: '', fats: '', notes: '',
};

// ─── Autocomplete Component 
const Autocomplete = ({ value, onChange, suggestions, placeholder, onSelect }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = value.trim().length >= 2
    ? suggestions.filter(s => s.toLowerCase().includes(value.toLowerCase())).slice(0, 8)
    : [];

  return (
    <div className="autocomplete-wrapper" ref={ref}>
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <ul className="autocomplete-dropdown">
          {filtered.map((item, i) => (
            <li key={i} className="autocomplete-item" onMouseDown={() => { onSelect(item); setOpen(false); }}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


// WORKOUT SECTION

const WorkoutSection = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [exerciseList, setExerciseList] = useState([]); // queued exercises
  const [current, setCurrent] = useState({ ...DEFAULT_EXERCISE });
  const [totalDuration, setTotalDuration] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const isCardio = selectedGroup?.workoutType === 'cardio';

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setCurrent({ ...DEFAULT_EXERCISE, muscleGroup: group.label });
    setErrors({});
  };

  const allExercises = Object.values(EXERCISES).flat();
  const groupExercises = selectedGroup ? EXERCISES[selectedGroup.id] : [];

  const validateCurrent = () => {
    const e = {};
    if (!current.name.trim()) e.name = 'Exercise name is required.';
    if (isCardio) {
      if (!current.duration || Number(current.duration) < 1) e.duration = 'Duration must be at least 1 min.';
    } else {
      if (!current.sets || Number(current.sets) < 1) e.sets = 'Sets must be ≥ 1.';
      if (!current.reps || Number(current.reps) < 1) e.reps = 'Reps must be ≥ 1.';
      if (current.weightKg !== '' && Number(current.weightKg) < 0) e.weightKg = 'Weight cannot be negative.';
    }
    return e;
  };

  const handleAddExercise = () => {
    const e = validateCurrent();
    if (Object.keys(e).length) { setErrors(e); return; }
    setExerciseList(prev => [...prev, { ...current }]);
    setCurrent({ ...DEFAULT_EXERCISE, muscleGroup: selectedGroup?.label || '' });
    setErrors({});
  };

  const handleRemoveExercise = (idx) => setExerciseList(prev => prev.filter((_, i) => i !== idx));

  const handleSubmitWorkout = async () => {
    if (exerciseList.length === 0) { setErrorMsg('Add at least one exercise before submitting.'); return; }
    if (!totalDuration || Number(totalDuration) < 1) { setErrorMsg('Total workout duration is required (min 1 min).'); return; }
    setIsSubmitting(true); setErrorMsg(''); setSuccessMsg('');
    try {
      const payload = {
        workoutType: selectedGroup?.workoutType || 'other',
        duration: Number(totalDuration),
        caloriesBurned: caloriesBurned ? Number(caloriesBurned) : 0,
        notes: workoutNotes,
        exercises: exerciseList.map(ex => ({
          name: ex.name,
          sets:     ex.sets     ? Number(ex.sets)     : undefined,
          reps:     ex.reps     ? Number(ex.reps)     : undefined,
          weightKg: ex.weightKg ? Number(ex.weightKg) : undefined,
          notes:    ex.notes    || undefined,
        })),
      };
      await trackingService.createWorkout(payload);
      setSuccessMsg(`✅ Workout logged! ${exerciseList.length} exercise${exerciseList.length > 1 ? 's' : ''} saved.`);
      setExerciseList([]); setCurrent({ ...DEFAULT_EXERCISE }); setSelectedGroup(null);
      setTotalDuration(''); setCaloriesBurned(''); setWorkoutNotes('');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to log workout. Please try again.');
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="tracking-section">
      <div className="tracking-section-header">
        <div className="tracking-icon">💪</div>
        <div>
          <h2 className="tracking-title">Workout Logger</h2>
          <p className="tracking-subtitle">Select a muscle group, add exercises, then submit.</p>
        </div>
      </div>

      {/* Status messages */}
      {successMsg && <div className="track-alert track-alert-success">{successMsg}</div>}
      {errorMsg   && <div className="track-alert track-alert-error">{errorMsg}</div>}

      {/* Step 1: Muscle group picker */}
      <div className="muscle-group-section">
        <label className="form-label">1. Select Muscle Group</label>
        <div className="muscle-group-grid">
          {MUSCLE_GROUPS.map(g => (
            <button
              key={g.id}
              type="button"
              className={`muscle-btn ${selectedGroup?.id === g.id ? 'active' : ''}`}
              onClick={() => handleGroupSelect(g)}
            >
              <img src={g.image} alt={g.label} className="muscle-btn-img" />
              <span className="muscle-btn-label">{g.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Exercise builder */}
      {selectedGroup && (
        <div className="exercise-builder">
          <label className="form-label">2. Add Exercise — {selectedGroup.label}</label>

          <div className="form-group">
            <label>Exercise Name</label>
            <Autocomplete
              value={current.name}
              onChange={v => setCurrent(p => ({ ...p, name: v }))}
              suggestions={[...groupExercises, ...allExercises]}
              placeholder={`Search ${selectedGroup.label} exercises...`}
              onSelect={v => { setCurrent(p => ({ ...p, name: v })); setErrors(prev => ({ ...prev, name: undefined })); }}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          {isCardio ? (
            /* Cardio fields */
            <div className="form-row">
              <div className="form-group">
                <label>Duration (mins)</label>
                <input type="number" onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} className={`form-control ${errors.duration ? 'input-error' : ''}`}
                  placeholder="e.g. 30" min="1"
                  value={current.duration}
                  onChange={e => setCurrent(p => ({ ...p, duration: e.target.value.replace('-', '') }))} />
                {errors.duration && <span className="field-error">{errors.duration}</span>}
              </div>
              <div className="form-group">
                <label>Distance (km) <span className="optional-tag">optional</span></label>
                <input type="number" onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} className="form-control" placeholder="e.g. 5" min="0" step="0.1"
                  value={current.weightKg}
                  onChange={e => setCurrent(p => ({ ...p, weightKg: e.target.value.replace('-', '') }))} />
              </div>
            </div>
          ) : (
            /* Strength fields */
            <>
              <div className="form-row three-col">
                <div className="form-group">
                  <label>Sets</label>
                  <input type="number" onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} className={`form-control ${errors.sets ? 'input-error' : ''}`}
                    placeholder="4" min="1"
                    value={current.sets}
                    onChange={e => setCurrent(p => ({ ...p, sets: e.target.value.replace('-', '') }))} />
                  {errors.sets && <span className="field-error">{errors.sets}</span>}
                </div>
                <div className="form-group">
                  <label>Reps</label>
                  <input type="number" onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} className={`form-control ${errors.reps ? 'input-error' : ''}`}
                    placeholder="10" min="1"
                    value={current.reps}
                    onChange={e => setCurrent(p => ({ ...p, reps: e.target.value.replace('-', '') }))} />
                  {errors.reps && <span className="field-error">{errors.reps}</span>}
                </div>
                <div className="form-group">
                  <label>Weight (kg)</label>
                  <input type="number" onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} className={`form-control ${errors.weightKg ? 'input-error' : ''}`}
                    placeholder="80" min="0" step="0.5"
                    value={current.weightKg}
                    onChange={e => setCurrent(p => ({ ...p, weightKg: e.target.value.replace('-', '') }))} />
                  {errors.weightKg && <span className="field-error">{errors.weightKg}</span>}
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Notes <span className="optional-tag">optional</span></label>
            <input type="text" className="form-control" placeholder="e.g. Last set was tough"
              value={current.notes}
              onChange={e => setCurrent(p => ({ ...p, notes: e.target.value.replace('-', '') }))} />
          </div>

          <button type="button" className="btn-add-exercise" onClick={handleAddExercise}>
            + Add to Workout
          </button>
        </div>
      )}

      {/* Exercise queue */}
      {exerciseList.length > 0 && (
        <div className="exercise-queue">
          <label className="form-label">3. Today's Workout ({exerciseList.length} exercise{exerciseList.length > 1 ? 's' : ''})</label>
          {exerciseList.map((ex, i) => (
            <div key={i} className="exercise-queue-item">
              <div className="exercise-queue-info">
                <span className="exercise-queue-num">{i + 1}</span>
                <div>
                  <div className="exercise-queue-name">{ex.name}</div>
                  <div className="exercise-queue-details">
                    {ex.muscleGroup && <span className="tag">{ex.muscleGroup}</span>}
                    {ex.sets   && <span className="tag">{ex.sets} sets</span>}
                    {ex.reps   && <span className="tag">× {ex.reps} reps</span>}
                    {ex.weightKg && <span className="tag">@ {ex.weightKg} kg</span>}
                    {ex.duration && <span className="tag">{ex.duration} min</span>}
                  </div>
                  {ex.notes && <div className="exercise-queue-notes">"{ex.notes}"</div>}
                </div>
              </div>
              <button type="button" className="btn-remove" onClick={() => handleRemoveExercise(i)} title="Remove">✕</button>
            </div>
          ))}

          {/* Workout summary fields */}
          <div className="workout-summary-fields">
            <div className="form-row">
              <div className="form-group">
                <label>Total Duration (mins) <span className="required-tag">*</span></label>
                <input type="number" onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} className="form-control" placeholder="e.g. 60" min="1"
                  value={totalDuration}
                  onChange={e => setTotalDuration(e.target.value.replace('-', ''))} />
              </div>
              <div className="form-group">
                <label>Calories Burned <span className="optional-tag">optional</span></label>
                <input type="number" onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} className="form-control" placeholder="e.g. 350" min="0"
                  value={caloriesBurned}
                  onChange={e => setCaloriesBurned(e.target.value.replace('-', ''))} />
              </div>
            </div>
            <div className="form-group">
              <label>Workout Notes <span className="optional-tag">optional</span></label>
              <input type="text" className="form-control" placeholder="e.g. Great pump today!"
                value={workoutNotes}
                onChange={e => setWorkoutNotes(e.target.value.replace('-', ''))} />
            </div>
          </div>

          <button type="button" className="btn-primary btn-submit-workout" onClick={handleSubmitWorkout} disabled={isSubmitting}>
            {isSubmitting ? 'LOGGING...' : `LOG WORKOUT (${exerciseList.length} exercise${exerciseList.length > 1 ? 's' : ''})`}
          </button>
        </div>
      )}

      {!selectedGroup && exerciseList.length === 0 && (
        <div className="empty-tracker">
          Select a muscle group above to start building your workout.
        </div>
      )}
    </div>
  );
};


// NUTRITION SECTION

const NutritionSection = () => {
  const [form, setForm] = useState({ ...DEFAULT_NUTRITION });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const foodNames = FOOD_DB.map(f => f.name);

  const handleFoodSelect = (name) => {
    const food = FOOD_DB.find(f => f.name === name);
    if (food) {
      setForm(p => ({
        ...p, foodName: name,
        calories: food.calories, protein: food.protein, carbs: food.carbs, fats: food.fats,
      }));
    } else {
      setForm(p => ({ ...p, foodName: name }));
    }
    setErrors(prev => ({ ...prev, foodName: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.foodName.trim()) e.foodName = 'Food name is required.';
    if (!form.mealType)        e.mealType = 'Meal type is required.';
    if (!form.quantity.trim()) e.quantity = 'Quantity is required.';
    if (form.calories === '' || form.calories === undefined) e.calories = 'Calories are required.';
    if (Number(form.calories) < 0) e.calories = 'Calories cannot be negative.';
    if (Number(form.protein)  < 0) e.protein  = 'Protein cannot be negative.';
    if (Number(form.carbs)    < 0) e.carbs    = 'Carbs cannot be negative.';
    if (Number(form.fats)     < 0) e.fats     = 'Fat cannot be negative.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setIsSubmitting(true); setErrorMsg(''); setSuccessMsg('');
    try {
     
      const mealTypeMap = {
        breakfast: 'breakfast', lunch: 'lunch', dinner: 'dinner',
        snack: 'snack', preworkout: 'snack', postworkout: 'snack',
      };
      await trackingService.createNutrition({
        foodName:  form.foodName,
        mealType:  mealTypeMap[form.mealType] || 'snack',
        calories:  Number(form.calories),
        protein:   Number(form.protein)  || 0,
        carbs:     Number(form.carbs)    || 0,
        fats:      Number(form.fats)     || 0,
      });
      setSuccessMsg(`✅ "${form.foodName}" logged successfully!`);
      setForm({ ...DEFAULT_NUTRITION });
      setErrors({});
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to log nutrition. Please try again.');
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="tracking-section">
      <div className="tracking-section-header">
        <div className="tracking-icon">🥗</div>
        <div>
          <h2 className="tracking-title">Nutrition Logger</h2>
          <p className="tracking-subtitle">Search for foods or enter custom entries.</p>
        </div>
      </div>

      {successMsg && <div className="track-alert track-alert-success">{successMsg}</div>}
      {errorMsg   && <div className="track-alert track-alert-error">{errorMsg}</div>}

      <form onSubmit={handleSubmit} noValidate>
        {/* Food search */}
        <div className="form-group">
          <label>Food Item <span className="required-tag">*</span></label>
          <Autocomplete
            value={form.foodName}
            onChange={v => setForm(p => ({ ...p, foodName: v }))}
            suggestions={foodNames}
            placeholder='Search food (e.g. "Chicken Breast", "Rice")'
            onSelect={handleFoodSelect}
          />
          {errors.foodName && <span className="field-error">{errors.foodName}</span>}
          <p className="field-hint">Not in list? Just type a custom name and fill in the macros below.</p>
        </div>

        <div className="form-row">
          {/* Meal type */}
          <div className="form-group">
            <label>Meal Type <span className="required-tag">*</span></label>
            <select className={`form-control ${errors.mealType ? 'input-error' : ''}`}
              value={form.mealType}
              onChange={e => setForm(p => ({ ...p, mealType: e.target.value.replace('-', '') }))}>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
              <option value="preworkout">Pre-Workout</option>
              <option value="postworkout">Post-Workout</option>
            </select>
            {errors.mealType && <span className="field-error">{errors.mealType}</span>}
          </div>

          {/* Quantity */}
          <div className="form-group">
            <label>Quantity / Serving <span className="required-tag">*</span></label>
            <input type="text" className={`form-control ${errors.quantity ? 'input-error' : ''}`}
              placeholder='e.g. "150g", "1 cup"'
              value={form.quantity}
              onChange={e => setForm(p => ({ ...p, quantity: e.target.value.replace('-', '') }))} />
            {errors.quantity && <span className="field-error">{errors.quantity}</span>}
          </div>
        </div>

        {/* Macros */}
        <div className="macros-label">
          <label className="form-label">Macronutrients</label>
          {FOOD_DB.find(f => f.name === form.foodName) && (
            <span className="macro-source-tag">Auto-filled from database</span>
          )}
        </div>
        <div className="form-row four-col">
          <div className="form-group">
            <label>Calories <span className="required-tag">*</span></label>
            <input type="number" onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} className={`form-control ${errors.calories ? 'input-error' : ''}`}
              placeholder="0" min="0"
              value={form.calories}
              onChange={e => setForm(p => ({ ...p, calories: e.target.value.replace('-', '') }))} />
            {errors.calories && <span className="field-error">{errors.calories}</span>}
          </div>
          <div className="form-group">
            <label>Protein (g)</label>
            <input type="number" onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} className={`form-control ${errors.protein ? 'input-error' : ''}`}
              placeholder="0" min="0"
              value={form.protein}
              onChange={e => setForm(p => ({ ...p, protein: e.target.value.replace('-', '') }))} />
            {errors.protein && <span className="field-error">{errors.protein}</span>}
          </div>
          <div className="form-group">
            <label>Carbs (g)</label>
            <input type="number" onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} className={`form-control ${errors.carbs ? 'input-error' : ''}`}
              placeholder="0" min="0"
              value={form.carbs}
              onChange={e => setForm(p => ({ ...p, carbs: e.target.value.replace('-', '') }))} />
            {errors.carbs && <span className="field-error">{errors.carbs}</span>}
          </div>
          <div className="form-group">
            <label>Fat (g)</label>
            <input type="number" onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} className={`form-control ${errors.fats ? 'input-error' : ''}`}
              placeholder="0" min="0"
              value={form.fats}
              onChange={e => setForm(p => ({ ...p, fats: e.target.value.replace('-', '') }))} />
            {errors.fats && <span className="field-error">{errors.fats}</span>}
          </div>
        </div>

        <button type="submit" className="btn-primary btn-submit-nutrition" disabled={isSubmitting}>
          {isSubmitting ? 'LOGGING...' : 'LOG FOOD'}
        </button>
      </form>
    </div>
  );
};

// WATER SECTION

const QUICK_WATER = [
  { label: '1 Glass', ml: 250 },
  { label: '½ Litre', ml: 500 },
  { label: '1 Litre', ml: 1000 },
  { label: 'Bottle', ml: 750 },
];

const WaterSection = () => {
  const [amountMl, setAmountMl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [todayEntries, setTodayEntries] = useState([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const fetchToday = async () => {
    try {
      setLoadingHistory(true);
      const today = new Date().toISOString().split('T')[0];
      const res = await trackingService.getWater(today);
      setTodayEntries(res.data.data || []);
      setTodayTotal(res.data.totalMl || 0);
    } catch {
      setTodayEntries([]);
      setTodayTotal(0);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => { fetchToday(); }, []);

  const handleQuickAdd = (ml) => {
    setAmountMl(String(ml));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const val = Number(amountMl);
    if (!val || val < 1) { setErrorMsg('Enter a valid amount (min 1 ml).'); return; }
    if (val > 5000) { setErrorMsg('Maximum 5000 ml per entry.'); return; }
    setIsSubmitting(true); setErrorMsg(''); setSuccessMsg('');
    try {
      await trackingService.createWater({ amountMl: val });
      setSuccessMsg(`✅ ${val} ml logged successfully!`);
      setAmountMl('');
      await fetchToday();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to log water. Please try again.');
    } finally { setIsSubmitting(false); }
  };

  const goalMl = 3000;
  const pct = Math.min(100, Math.round((todayTotal / goalMl) * 100));

  return (
    <div className="tracking-section">
      <div className="tracking-section-header">
        <div className="tracking-icon">💧</div>
        <div>
          <h2 className="tracking-title">Water Intake</h2>
          <p className="tracking-subtitle">Stay hydrated — track every glass.</p>
        </div>
      </div>

      {successMsg && <div className="track-alert track-alert-success">{successMsg}</div>}
      {errorMsg   && <div className="track-alert track-alert-error">{errorMsg}</div>}

      <div className="water-progress-bar-container">
        <div className="water-progress-label">
          <span>Today: <strong>{todayTotal} ml</strong></span>
          <span>{pct}% of {goalMl / 1000}L goal</span>
        </div>
        <div className="water-progress-track">
          <div className="water-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="water-quick-btns">
        {QUICK_WATER.map(q => (
          <button key={q.ml} type="button" className={`water-quick-btn ${String(amountMl) === String(q.ml) ? 'active' : ''}`}
            onClick={() => handleQuickAdd(q.ml)}>
            {q.label}<span className="water-quick-ml">{q.ml} ml</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="water-form">
        <div className="form-group">
          <label>Amount (ml) <span className="required-tag">*</span></label>
          <input type="number" className="form-control" placeholder="e.g. 250"
            min="1" max="5000" value={amountMl}
            onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }}
            onChange={e => setAmountMl(e.target.value.replace('-', ''))} />
        </div>
        <button type="submit" className="btn-primary btn-submit-water" disabled={isSubmitting}>
          {isSubmitting ? 'LOGGING...' : 'LOG WATER'}
        </button>
      </form>

      <div className="water-history">
        <h3 className="history-title">Today's Log</h3>
        {loadingHistory ? (
          <div className="empty-tracker">Loading...</div>
        ) : todayEntries.length === 0 ? (
          <div className="empty-tracker">No water logged today. Start hydrating!</div>
        ) : (
          <div className="history-list">
            {todayEntries.map((entry, i) => (
              <div key={entry._id || i} className="history-item">
                <span className="history-item-icon">💧</span>
                <span className="history-item-value">{entry.amountMl} ml</span>
                <span className="history-item-time">{new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


// WEIGHT SECTION

const WeightSection = () => {
  const [weight, setWeight] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await trackingService.getWeight();
      setHistory(res.data.data || []);
    } catch {
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const val = Number(weight);
    if (!val || val < 10) { setErrorMsg('Enter a valid weight (min 10 kg).'); return; }
    if (val > 500) { setErrorMsg('Maximum 500 kg.'); return; }
    setIsSubmitting(true); setErrorMsg(''); setSuccessMsg('');
    try {
      await trackingService.createWeight({ weight: val });
      setSuccessMsg(`✅ Weight ${val} kg logged successfully!`);
      setWeight('');
      await fetchHistory();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to log weight. Please try again.');
    } finally { setIsSubmitting(false); }
  };

  const latest = history.length > 0 ? history[0] : null;
  const previous = history.length > 1 ? history[1] : null;
  const diff = latest && previous ? (latest.weight - previous.weight).toFixed(1) : null;

  return (
    <div className="tracking-section">
      <div className="tracking-section-header">
        <div className="tracking-icon">⚖️</div>
        <div>
          <h2 className="tracking-title">Weight Tracker</h2>
          <p className="tracking-subtitle">Log your body weight to monitor progress.</p>
        </div>
      </div>

      {successMsg && <div className="track-alert track-alert-success">{successMsg}</div>}
      {errorMsg   && <div className="track-alert track-alert-error">{errorMsg}</div>}

      {latest && (
        <div className="weight-current-card">
          <div className="weight-current-label">Current Weight</div>
          <div className="weight-current-value">{latest.weight} <span>kg</span></div>
          {diff !== null && (
            <div className={`weight-diff ${Number(diff) > 0 ? 'up' : Number(diff) < 0 ? 'down' : 'same'}`}>
              {Number(diff) > 0 ? '▲' : Number(diff) < 0 ? '▼' : '—'} {Math.abs(Number(diff))} kg from previous
            </div>
          )}
          <div className="weight-current-date">Last updated: {new Date(latest.date).toLocaleDateString()}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="weight-form">
        <div className="form-group">
          <label>Weight (kg) <span className="required-tag">*</span></label>
          <input type="number" className="form-control" placeholder="e.g. 72.5"
            min="10" max="500" step="0.1" value={weight}
            onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }}
            onChange={e => setWeight(e.target.value.replace('-', ''))} />
        </div>
        <button type="submit" className="btn-primary btn-submit-weight" disabled={isSubmitting}>
          {isSubmitting ? 'LOGGING...' : 'LOG WEIGHT'}
        </button>
      </form>

      <div className="weight-history">
        <h3 className="history-title">Recent History</h3>
        {loadingHistory ? (
          <div className="empty-tracker">Loading...</div>
        ) : history.length === 0 ? (
          <div className="empty-tracker">No weight entries yet. Log your first weigh-in!</div>
        ) : (
          <div className="history-list">
            {history.slice(0, 10).map((entry, i) => (
              <div key={entry._id || i} className="history-item">
                <span className="history-item-icon">⚖️</span>
                <span className="history-item-value">{entry.weight} kg</span>
                <span className="history-item-time">{new Date(entry.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


// MAIN PAGE

const Tracking = () => {
  useDocumentTitle('Tracking');
  const [activeTab, setActiveTab] = useState('workout');

  return (
    <div className="tracking-page">
      <div className="page-header">
        <h1 className="page-title">Daily Tracking</h1>
        <p className="page-subtitle">Log your workouts, nutrition, water and weight to stay on track.</p>
      </div>

      {/* Tab switcher */}
      <div className="tracking-tabs">
        <button
          className={`tracking-tab ${activeTab === 'workout' ? 'active' : ''}`}
          onClick={() => setActiveTab('workout')}
        >
          💪 Workout
        </button>
        <button
          className={`tracking-tab ${activeTab === 'nutrition' ? 'active' : ''}`}
          onClick={() => setActiveTab('nutrition')}
        >
          🥗 Nutrition
        </button>
        <button
          className={`tracking-tab ${activeTab === 'water' ? 'active' : ''}`}
          onClick={() => setActiveTab('water')}
        >
          💧 Water
        </button>
        <button
          className={`tracking-tab ${activeTab === 'weight' ? 'active' : ''}`}
          onClick={() => setActiveTab('weight')}
        >
          ⚖️ Weight
        </button>
      </div>

      <div className="tracking-tab-content">
        {activeTab === 'workout'   && <WorkoutSection />}
        {activeTab === 'nutrition' && <NutritionSection />}
        {activeTab === 'water'     && <WaterSection />}
        {activeTab === 'weight'    && <WeightSection />}
      </div>
    </div>
  );
};

export default Tracking;
