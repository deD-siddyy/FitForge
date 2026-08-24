import { useDocumentTitle } from '../hooks';
import './Assessment.css';

const Assessment = () => {
  useDocumentTitle('Assessment');

  return (
    <div className="assessment-container">
      <div className="page-header">
        <h1 className="page-title">Fitness Assessment</h1>
        <p className="page-subtitle">Let's establish your baseline to tailor your forge.</p>
      </div>

      <div className="card">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="assessment-form-grid">
            
            {/* Personal Details */}
            <div className="form-group">
              <label>Age</label>
              <input type="number" className="form-control" placeholder="Years" />
            </div>
            
            <div className="form-group">
              <label>Gender</label>
              <select className="form-control">
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Height (cm)</label>
              <input type="number" className="form-control" placeholder="e.g. 175" />
            </div>
            
            <div className="form-group">
              <label>Weight (kg)</label>
              <input type="number" className="form-control" placeholder="e.g. 70" />
            </div>

            {/* Goals & Activity */}
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Primary Goal</label>
              <select className="form-control">
                <option value="">Select goal...</option>
                <option value="fat_loss">Fat Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Activity Level</label>
              <select className="form-control">
                <option value="">Select activity level...</option>
                <option value="sedentary">Sedentary (Little or no exercise)</option>
                <option value="light">Light (Exercise 1-3 days/week)</option>
                <option value="moderate">Moderate (Exercise 3-5 days/week)</option>
                <option value="active">Active (Exercise 6-7 days/week)</option>
                <option value="very_active">Very Active (Hard exercise daily)</option>
              </select>
            </div>

          </div>

          <div className="assessment-footer">
            <button className="btn-primary" style={{ paddingLeft: '3rem', paddingRight: '3rem' }}>
              CALCULATE METRICS
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Assessment;
