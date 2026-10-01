import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { colors } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const styles = {
    navbar: {
      backgroundColor: colors.secondary,
      padding: '1rem 0',
      boxShadow: `0 2px 4px ${colors.shadow}`,
      transition: 'all 0.3s ease',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    brand: {
      color: '#fff',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      textDecoration: 'none',
    },
    navLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
    },
    link: {
      color: '#fff',
      textDecoration: 'none',
      transition: 'color 0.3s',
    },
    userName: {
      color: colors.primary,
      fontWeight: '500',
    },
    registerButton: {
      backgroundColor: colors.primary,
      color: '#fff',
      padding: '0.5rem 1.5rem',
      borderRadius: '5px',
      textDecoration: 'none',
      transition: 'background-color 0.3s',
    },
    logoutButton: {
      backgroundColor: colors.error,
      color: '#fff',
      padding: '0.5rem 1.5rem',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
      transition: 'background-color 0.3s',
    },
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.brand}>
          Professional Services
        </Link>

        <div style={styles.navLinks}>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/products" style={styles.link}>Services</Link>

          {isAuthenticated ? (
            <>
              {isAdmin() ? (
                <>
                  <Link to="/admin" style={styles.link}>Dashboard</Link>
                  <Link to="/admin/products" style={styles.link}>Products</Link>
                </>
              ) : (
                <Link to="/orders" style={styles.link}>My Orders</Link>
              )}
              <span style={styles.userName}>Hi, {user?.name}</span>
              <ThemeToggle />
              <button onClick={handleLogout} style={styles.logoutButton}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <ThemeToggle />
              <Link to="/register" style={styles.registerButton}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
