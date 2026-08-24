import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/tracking', label: 'Tracking', icon: '📝' },
    { path: '/assessment', label: 'Assessment', icon: '📋' },
  ];


  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">
          <span className="brand-icon">🏋️</span>
          <span className="brand-text">FITFORGE</span>
        </Link>
      </div>
      <div className="nav-links">
        {navItems.map(item => (
          <Link 
            key={item.path} 
            to={item.path}
            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </div>
      <div className="nav-actions">
        {user && <span className="nav-user-name" style={{ marginRight: '1rem', color: 'var(--text-muted)' }}>{user.name}</span>}
        <button className="btn-logout" onClick={handleLogout}>
          LOGOUT
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
