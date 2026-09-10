import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context';
import { ProtectedRoute, Navbar } from './components';

// Pages
import { Login, Register, Dashboard, Assessment, Tracking } from './pages';

function App() {
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case '/login':
        document.title = 'FitForge | Login';
        break;
      case '/register':
        document.title = 'FitForge | Register';
        break;
      case '/dashboard':
        document.title = 'FitForge | Dashboard';
        break;
      case '/assessment':
        document.title = 'FitForge | Assessment';
        break;
      case '/tracking':
        document.title = 'FitForge | Tracking';
        break;
      case '/profile':
        document.title = 'FitForge | Profile';
        break;
      default:
        document.title = 'FitForge';
    }
  }, [location]);
  return (
    <AuthProvider>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assessment"
              element={
                <ProtectedRoute>
                  <Assessment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tracking"
              element={
                <ProtectedRoute>
                  <Tracking />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
