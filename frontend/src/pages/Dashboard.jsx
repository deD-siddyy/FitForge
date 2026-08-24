import { useState, useEffect } from 'react';
import { useAuth } from '../context';
import { useDocumentTitle } from '../hooks';
import { dashboardService } from '../services';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line
} from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  useDocumentTitle('Dashboard');

  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardService.get();
      // Backend typically sends { success: true, data: { today: {...}, weekly: {...} } }
      setData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Forging your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-icon">⚠️</div>
        <p>{error}</p>
        <button className="btn-primary" onClick={fetchDashboardData}>RETRY</button>
      </div>
    );
  }

  // Fallback to avoid crashes if data is missing
  const today = data?.today || {};
  const weekly = data?.weekly || {};
  
  const hasNutrition = today.nutrition?.entries > 0;
  const hasWater = today.water?.entries > 0;
  const hasWorkout = today.workout?.count > 0;

  // Format chart data date strings
  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h1 className="page-title">Welcome Back, {user?.name ? user.name.split(' ')[0] : 'Athlete'}!</h1>
        <p className="page-subtitle">Here is your daily fitness overview.</p>
      </div>

      <h2 className="section-title">Today's Progress</h2>
      
      <div className="stats-grid">
        {/* Calories Card */}
        <div className="stat-card">
          <div className="stat-header">
            <span>Calories</span>
            <span className="stat-icon">🔥</span>
          </div>
          <div className="stat-value">
            {hasNutrition ? today.nutrition.calories : '0'}
          </div>
          <div className="stat-label">
            {hasNutrition ? 'Consumed Today (kcal)' : '0 kcal'}
          </div>
          {hasNutrition && (
            <div className="macros-row">
              <span className="macro protein">P: {today.nutrition.protein}g</span>
              <span className="macro carbs">C: {today.nutrition.carbs}g</span>
              <span className="macro fats">F: {today.nutrition.fats}g</span>
            </div>
          )}
        </div>
        
        {/* Water Card */}
        <div className="stat-card">
          <div className="stat-header">
            <span>Water</span>
            <span className="stat-icon">💧</span>
          </div>
          <div className="stat-value">
            {hasWater ? today.water.totalMl : '0'}
          </div>
          <div className="stat-label">
            {hasWater ? 'Intake Today (ml)' : '0 ml'}
          </div>
        </div>

        {/* Workout Card */}
        <div className="stat-card">
          <div className="stat-header">
            <span>Workout</span>
            <span className="stat-icon">💪</span>
          </div>
          <div className="stat-value" style={{ fontSize: hasWorkout ? '2.25rem' : '1.5rem', marginTop: hasWorkout ? '0' : '0.5rem' }}>
            {hasWorkout ? `${today.workout.count} Session${today.workout.count > 1 ? 's' : ''}` : 'No workout recorded'}
          </div>
          <div className="stat-label">
            {hasWorkout ? `${today.workout.caloriesBurned} kcal burned` : 'Log a workout to see stats'}
          </div>
        </div>

        {/* Weight Card */}
        <div className="stat-card">
          <div className="stat-header">
            <span>Weight</span>
            <span className="stat-icon">⚖️</span>
          </div>
          <div className="stat-value" style={{ fontSize: today.latestWeight ? '2.25rem' : '1.5rem', marginTop: today.latestWeight ? '0' : '0.5rem' }}>
            {today.latestWeight ? today.latestWeight : 'No weight recorded'}
          </div>
          <div className="stat-label">
            {today.latestWeight ? 'Current Weight (kg)' : 'Update your profile to set weight'}
          </div>
        </div>
      </div>

      <h2 className="section-title">Weekly Trends</h2>
      
      <div className="charts-grid">
        {/* Calories Chart */}
        <div className="chart-card">
          <h3 className="chart-title">Calorie Intake (7 Days)</h3>
          {weekly.calorieTrend && weekly.calorieTrend.length > 0 ? (
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weekly.calorieTrend}>
                  <defs>
                    <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff4500" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ff4500" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate} 
                    stroke="#9ca3af" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#9ca3af" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1d24', border: '1px solid #2d3748', borderRadius: '8px' }}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                  />
                  <Area type="monotone" dataKey="calories" stroke="#ff4500" strokeWidth={3} fillOpacity={1} fill="url(#colorCal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="empty-state">No calorie data for the past 7 days.</div>
          )}
        </div>

        {/* Water Chart */}
        <div className="chart-card">
          <h3 className="chart-title">Water Intake (7 Days)</h3>
          {weekly.waterTrend && weekly.waterTrend.length > 0 ? (
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekly.waterTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate} 
                    stroke="#9ca3af" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#9ca3af" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1d24', border: '1px solid #2d3748', borderRadius: '8px' }}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    cursor={{fill: '#232730'}}
                  />
                  <Bar dataKey="ml" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="empty-state">No water data for the past 7 days.</div>
          )}
        </div>
        
        {/* Weight Chart */}
        <div className="chart-card">
          <h3 className="chart-title">Weight History (7 Days)</h3>
          {weekly.weightHistory && weekly.weightHistory.length > 0 ? (
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weekly.weightHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate} 
                    stroke="#9ca3af" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    domain={['dataMin - 2', 'dataMax + 2']}
                    stroke="#9ca3af" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1d24', border: '1px solid #2d3748', borderRadius: '8px' }}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                  />
                  <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="empty-state">No weight data for the past 7 days.</div>
          )}
        </div>

        {/* Weekly Workouts Summary */}
        <div className="chart-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <h3 className="chart-title" style={{ marginBottom: '1rem' }}>Weekly Workouts</h3>
          <div className="stat-icon" style={{ width: '80px', height: '80px', fontSize: '3rem', marginBottom: '1rem', background: 'rgba(255, 69, 0, 0.1)' }}>💪</div>
          <div className="stat-value" style={{ fontSize: '3.5rem' }}>{weekly.workoutCount || 0}</div>
          <div className="stat-label" style={{ fontSize: '1.1rem', marginTop: '0.5rem' }}>Sessions this week</div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
