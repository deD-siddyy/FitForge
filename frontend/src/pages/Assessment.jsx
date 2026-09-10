import { useState, useEffect } from 'react';
import { useDocumentTitle } from '../hooks';
import { fitnessService } from '../services';
import './Assessment.css';

const Assessment = () => {
  useDocumentTitle('Assessment');

  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    goal: 'weight_loss',
    activityLevel: 'moderately_active',
    workoutExperience: 'beginner'
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [hasExisting, setHasExisting] = useState(false);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const { data } = await fitnessService.get();
        if (data && data.data) {
          const assessment = data.data;
          setFormData({
            age: assessment.age || '',
            gender: assessment.gender || 'male',
            height: assessment.height || '',
            weight: assessment.weight || '',
            goal: assessment.goal || 'weight_loss',
            activityLevel: assessment.activityLevel || 'moderately_active',
            workoutExperience: assessment.workoutExperience || 'beginner',
          });
          setResults({
            bmi: assessment.bmi,
            bmr: assessment.bmr,
            dailyCalorieTarget: assessment.dailyCalorieTarget,
            workoutRecommendation: assessment.workoutRecommendation,
            dietRecommendation: assessment.dietRecommendation,
          });
          setHasExisting(true);
        }
      } catch (err) {
  
        if (err.response?.status !== 404) {
          console.error('Failed to load assessment', err);
        }
      }
    };
    fetchAssessment();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
     
      const payload = {
        ...formData,
        age: Number(formData.age),
        height: Number(formData.height),
        weight: Number(formData.weight),
      };

      let response;
      if (hasExisting) {
        response = await fitnessService.update(payload);
      } else {
        response = await fitnessService.create(payload);
      }

      if (response.data?.data) {
        const assessment = response.data.data;
        setResults({
          bmi: assessment.bmi,
          bmr: assessment.bmr,
          dailyCalorieTarget: assessment.dailyCalorieTarget,
          workoutRecommendation: assessment.workoutRecommendation,
          dietRecommendation: assessment.dietRecommendation,
        });
        setHasExisting(true);
        setSuccessMsg('Assessment successfully updated!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to calculate metrics.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assessment-container">
      <div className="page-header">
        <h1 className="page-title">Fitness Assessment</h1>
        <p className="page-subtitle">Let's establish your baseline to tailor your forge.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="assessment-form-grid">
            
            {/* Personal Details */}
            <div className="form-group">
              <label>Age</label>
              <input 
                type="number" 
                name="age"
                className="form-control" 
                placeholder="Years" 
                value={formData.age}
                onChange={handleChange}
                min="10"
                max="100"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" className="form-control" value={formData.gender} onChange={handleChange} required>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Height (cm)</label>
              <input 
                type="number" 
                name="height"
                className="form-control" 
                placeholder="e.g. 175"
                value={formData.height}
                onChange={handleChange}
                min="50"
                max="300"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Weight (kg)</label>
              <input 
                type="number" 
                name="weight"
                className="form-control" 
                placeholder="e.g. 70" 
                value={formData.weight}
                onChange={handleChange}
                min="10"
                max="500"
                required
              />
            </div>

            {/* Goals & Activity */}
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Primary Goal</label>
              <select name="goal" className="form-control" value={formData.goal} onChange={handleChange} required>
                <option value="weight_loss">Fat Loss / Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Activity Level</label>
              <select name="activityLevel" className="form-control" value={formData.activityLevel} onChange={handleChange} required>
                <option value="sedentary">Sedentary (Little to no exercise)</option>
                <option value="lightly_active">Lightly Active (Exercise 1-3 days/week)</option>
                <option value="moderately_active">Moderately Active (Exercise 3-5 days/week)</option>
                <option value="very_active">Very Active (Exercise 6-7 days/week)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Workout Experience</label>
              <select name="workoutExperience" className="form-control" value={formData.workoutExperience} onChange={handleChange} required>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

          </div>

          <div className="assessment-footer">
            <button type="submit" className="btn-primary" style={{ paddingLeft: '3rem', paddingRight: '3rem' }} disabled={loading}>
              {loading ? 'CALCULATING...' : 'CALCULATE METRICS'}
            </button>
          </div>
        </form>
      </div>

      {/* Results Display */}
      {results && (
        <div className="results-container card" style={{ marginTop: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', color: '#fff', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Your Metrics & Plan</h2>
          
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>BMI</h3>
              <div className="metric-value">{results.bmi}</div>
              <p>Body Mass Index</p>
            </div>
            <div className="metric-card">
              <h3>BMR</h3>
              <div className="metric-value">{results.bmr}</div>
              <p>Basal Metabolic Rate (kcal)</p>
            </div>
            <div className="metric-card">
              <h3>Daily Target</h3>
              <div className="metric-value">{results.dailyCalorieTarget}</div>
              <p>Calories/Day</p>
            </div>
          </div>

          {results.dietRecommendation && (
            <div className="recommendation-section">
              <h3>🥗 Diet Strategy: {results.dietRecommendation.strategy}</h3>
              <ul>
                <li><strong>Target:</strong> {results.dietRecommendation.dailyCalorieTarget} kcal/day</li>
                <li><strong>Protein:</strong> {results.dietRecommendation.proteinTarget}</li>
                <li><strong>Macros:</strong> Carbs ({results.dietRecommendation.macroGuidance?.carbohydrates}), Fats ({results.dietRecommendation.macroGuidance?.fats})</li>
                <li><strong>Tip:</strong> {results.dietRecommendation.mealTimingTip}</li>
              </ul>
            </div>
          )}

          {results.workoutRecommendation && (
            <div className="recommendation-section">
              <h3>💪 Workout Plan: {results.workoutRecommendation.focus}</h3>
              <ul>
                <li><strong>Frequency:</strong> {results.workoutRecommendation.weeklyFrequency}</li>
                <li><strong>Duration:</strong> {results.workoutRecommendation.sessionDuration}</li>
                <li><strong>Cardio:</strong> {results.workoutRecommendation.cardio}</li>
                <li><strong>Notes:</strong> {results.workoutRecommendation.notes}</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Assessment;
