import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { colors } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  const styles = {
    navbar: {
      backgroundColor: colors.secondary,
      padding: '0.85rem 0',
      boxShadow: `0 4px 12px ${colors.shadow}`,
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      transition: 'all 0.3s ease',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1.25rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    brand: {
      color: '#fff',
      fontSize: '1.35rem',
      fontWeight: 'bold',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    brandAccent: {
      color: colors.primary,
    },
    navLinksDesktop: {
      display: isMobile ? 'none' : 'flex',
      alignItems: 'center',
      gap: '1.25rem',
    },
    hamburger: {
      display: isMobile ? 'flex' : 'none',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '40px',
      height: '40px',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      zIndex: 1001,
    },
    bar: {
      width: '24px',
      height: '3px',
      backgroundColor: '#fff',
      margin: '2px 0',
      borderRadius: '2px',
      transition: 'all 0.3s ease',
    },
    link: {
      color: '#fff',
      textDecoration: 'none',
      fontWeight: '500',
      padding: '0.5rem 0.75rem',
      borderRadius: '6px',
      transition: 'all 0.2s ease',
    },
    activeLink: {
      color: colors.primary,
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    userName: {
      color: colors.primary,
      fontWeight: '600',
      fontSize: '0.95rem',
      padding: '0.4rem 0.8rem',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderRadius: '20px',
    },
    registerButton: {
      backgroundColor: colors.primary,
      color: '#fff',
      padding: '0.55rem 1.3rem',
      borderRadius: '25px',
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: '0.95rem',
      boxShadow: `0 4px 14px ${colors.primary}40`,
      transition: 'all 0.2s ease',
    },
    logoutButton: {
      backgroundColor: colors.error,
      color: '#fff',
      padding: '0.5rem 1.2rem',
      borderRadius: '20px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.95rem',
      transition: 'all 0.2s ease',
    },
    // Mobile Drawer Overlay
    mobileMenu: {
      display: isMobile && mobileOpen ? 'flex' : 'none',
      flexDirection: 'column',
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: colors.secondary,
      padding: '1.5rem',
      gap: '1.25rem',
      borderTop: `1px solid rgba(255, 255, 255, 0.1)`,
      boxShadow: `0 10px 25px ${colors.shadow}`,
      animation: 'fadeInUp 0.3s ease-out',
    },
    mobileItem: {
      width: '100%',
      textAlign: 'center',
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.brand}>
          🚀 <span style={styles.brandAccent}>Pro</span>Services
        </Link>

        {/* Desktop Nav Links */}
        <div style={styles.navLinksDesktop}>
          <Link 
            to="/" 
            style={{ ...styles.link, ...(isActive('/') ? styles.activeLink : {}) }}
          >
            Home
          </Link>
          <Link 
            to="/products" 
            style={{ ...styles.link, ...(isActive('/products') ? styles.activeLink : {}) }}
          >
            Services
          </Link>

          {isAuthenticated ? (
            <>
              {isAdmin() ? (
                <>
                  <Link 
                    to="/admin" 
                    style={{ ...styles.link, ...(isActive('/admin') ? styles.activeLink : {}) }}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/admin/products" 
                    style={{ ...styles.link, ...(isActive('/admin/products') ? styles.activeLink : {}) }}
                  >
                    Products
                  </Link>
                </>
              ) : (
                <Link 
                  to="/orders" 
                  style={{ ...styles.link, ...(isActive('/orders') ? styles.activeLink : {}) }}
                >
                  My Orders
                </Link>
              )}
              <span style={styles.userName}>👋 {user?.name?.split(' ')[0]}</span>
              <ThemeToggle />
              <button onClick={handleLogout} style={styles.logoutButton}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                style={{ ...styles.link, ...(isActive('/login') ? styles.activeLink : {}) }}
              >
                Login
              </Link>
              <ThemeToggle />
              <Link to="/register" style={styles.registerButton}>
                Register
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Toggle Button for Mobile */}
        <button 
          style={styles.hamburger} 
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Navigation Menu"
        >
          <div style={{
            ...styles.bar,
            transform: mobileOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
          }} />
          <div style={{
            ...styles.bar,
            opacity: mobileOpen ? 0 : 1
          }} />
          <div style={{
            ...styles.bar,
            transform: mobileOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
          }} />
        </button>
      </div>

      {/* Mobile Nav Menu Drawer */}
      {isMobile && (
        <div style={styles.mobileMenu}>
          <Link 
            to="/" 
            style={{ ...styles.link, ...styles.mobileItem, ...(isActive('/') ? styles.activeLink : {}) }}
          >
            Home
          </Link>
          <Link 
            to="/products" 
            style={{ ...styles.link, ...styles.mobileItem, ...(isActive('/products') ? styles.activeLink : {}) }}
          >
            Services
          </Link>

          {isAuthenticated ? (
            <>
              {isAdmin() ? (
                <>
                  <Link 
                    to="/admin" 
                    style={{ ...styles.link, ...styles.mobileItem, ...(isActive('/admin') ? styles.activeLink : {}) }}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/admin/products" 
                    style={{ ...styles.link, ...styles.mobileItem, ...(isActive('/admin/products') ? styles.activeLink : {}) }}
                  >
                    Products
                  </Link>
                </>
              ) : (
                <Link 
                  to="/orders" 
                  style={{ ...styles.link, ...styles.mobileItem, ...(isActive('/orders') ? styles.activeLink : {}) }}
                >
                  My Orders
                </Link>
              )}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                <span style={styles.userName}>👋 {user?.name}</span>
                <ThemeToggle />
              </div>
              <button onClick={handleLogout} style={{ ...styles.logoutButton, width: '100%', marginTop: '0.5rem' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', width: '100%' }}>
                <Link 
                  to="/login" 
                  style={{ ...styles.link, flex: 1, textAlign: 'center', border: `1px solid ${colors.border}`, borderRadius: '20px' }}
                >
                  Login
                </Link>
                <ThemeToggle />
              </div>
              <Link to="/register" style={{ ...styles.registerButton, textAlign: 'center', width: '100%' }}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
