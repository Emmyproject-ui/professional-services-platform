import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { colors } = useTheme();

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1rem',
    },
    hero: {
      textAlign: 'center',
      padding: '4rem 0',
      background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}10)`,
      borderRadius: '20px',
      marginBottom: '4rem',
      position: 'relative',
      overflow: 'hidden',
    },
    heroBackground: {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      background: `radial-gradient(circle at 50% 50%, ${colors.primary}20, transparent 70%)`,
    },
    heroContent: {
      position: 'relative',
      zIndex: 2,
    },
    title: {
      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
      color: colors.text,
      marginBottom: '1rem',
      fontWeight: '800',
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      animation: 'fadeInUp 0.8s ease-out',
    },
    subtitle: {
      fontSize: 'clamp(1rem, 3vw, 1.5rem)',
      color: colors.textSecondary,
      marginBottom: '2rem',
      animation: 'fadeInUp 0.8s ease-out 0.2s backwards',
    },
    emoji: {
      fontSize: '4rem',
      marginBottom: '1rem',
      display: 'block',
      animation: 'bounce 2s infinite',
    },
    buttonGroup: {
      display: 'flex',
      gap: '1.5rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
      animation: 'fadeInUp 0.8s ease-out 0.4s backwards',
    },
    primaryButton: {
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.primary}dd)`,
      color: '#fff',
      padding: '1.2rem 2.5rem',
      borderRadius: '50px',
      textDecoration: 'none',
      fontSize: '1.1rem',
      fontWeight: '600',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: `0 8px 25px ${colors.primary}40`,
      position: 'relative',
      overflow: 'hidden',
    },
    secondaryButton: {
      background: colors.surface,
      color: colors.text,
      padding: '1.2rem 2.5rem',
      borderRadius: '50px',
      textDecoration: 'none',
      fontSize: '1.1rem',
      fontWeight: '600',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: `0 8px 25px ${colors.shadow}`,
      border: `2px solid ${colors.border}`,
    },
    features: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '2rem',
      marginTop: '4rem',
    },
    feature: {
      backgroundColor: colors.surface,
      padding: '2.5rem',
      borderRadius: '20px',
      boxShadow: `0 10px 30px ${colors.shadow}`,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      animation: 'fadeInUp 0.8s ease-out',
    },
    featureIcon: {
      fontSize: '3rem',
      marginBottom: '1.5rem',
      display: 'block',
    },
    featureTitle: {
      fontSize: '1.5rem',
      color: colors.text,
      marginBottom: '1rem',
      fontWeight: '700',
    },
    featureText: {
      color: colors.textSecondary,
      lineHeight: '1.7',
      fontSize: '1.1rem',
    },
    statsSection: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '2rem',
      margin: '4rem 0',
      padding: '3rem',
      background: colors.surface,
      borderRadius: '20px',
      boxShadow: `0 10px 30px ${colors.shadow}`,
    },
    stat: {
      textAlign: 'center',
    },
    statNumber: {
      fontSize: '2.5rem',
      fontWeight: '800',
      color: colors.primary,
      display: 'block',
      marginBottom: '0.5rem',
    },
    statLabel: {
      color: colors.textSecondary,
      fontSize: '1rem',
      fontWeight: '500',
    },
    testimonial: {
      background: colors.surface,
      padding: '3rem',
      borderRadius: '20px',
      boxShadow: `0 10px 30px ${colors.shadow}`,
      textAlign: 'center',
      marginTop: '4rem',
      position: 'relative',
    },
    testimonialText: {
      fontSize: '1.3rem',
      color: colors.text,
      fontStyle: 'italic',
      marginBottom: '1.5rem',
      lineHeight: '1.6',
    },
    testimonialAuthor: {
      color: colors.primary,
      fontWeight: '600',
      fontSize: '1.1rem',
    },
    testimonialQuote: {
      position: 'absolute',
      top: '1rem',
      left: '2rem',
      fontSize: '4rem',
      color: colors.primary + '30',
      fontFamily: 'serif',
    },
  };

  // Add hover effects with inline styles
  const addHoverEffect = (element, hoverStyles) => {
    element.onmouseenter = () => Object.assign(element.style, hoverStyles);
    element.onmouseleave = () => Object.assign(element.style, {});
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.heroBackground}></div>
        <div style={styles.heroContent}>
          <span style={styles.emoji}>🚀</span>
          <h1 style={styles.title}>Professional Services Platform</h1>
          <p style={styles.subtitle}>
            Your trusted partner for premium digital solutions that drive results
          </p>
          <div style={styles.buttonGroup}>
            <Link 
              to="/products" 
              style={styles.primaryButton}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px) scale(1.05)';
                e.target.style.boxShadow = `0 15px 35px ${colors.primary}60`;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = `0 8px 25px ${colors.primary}40`;
              }}
            >
              🎯 Explore Services
            </Link>
            {!isAuthenticated && (
              <Link 
                to="/register" 
                style={styles.secondaryButton}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = `0 15px 35px ${colors.shadow}`;
                  e.target.style.borderColor = colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = `0 8px 25px ${colors.shadow}`;
                  e.target.style.borderColor = colors.border;
                }}
              >
                ✨ Get Started Free
              </Link>
            )}
            {isAuthenticated && !isAdmin() && (
              <Link to="/orders" style={styles.secondaryButton}>
                📋 My Orders
              </Link>
            )}
            {isAuthenticated && isAdmin() && (
              <Link to="/admin" style={styles.secondaryButton}>
                ⚡ Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>

      <div style={styles.statsSection}>
        <div style={styles.stat}>
          <span style={styles.statNumber}>1000+</span>
          <span style={styles.statLabel}>Happy Clients</span>
        </div>
        <div style={styles.stat}>
          <span style={styles.statNumber}>50+</span>
          <span style={styles.statLabel}>Projects Completed</span>
        </div>
        <div style={styles.stat}>
          <span style={styles.statNumber}>99%</span>
          <span style={styles.statLabel}>Success Rate</span>
        </div>
        <div style={styles.stat}>
          <span style={styles.statNumber}>24/7</span>
          <span style={styles.statLabel}>Support Available</span>
        </div>
      </div>

      <div style={styles.features}>
        <div 
          style={styles.feature}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.boxShadow = `0 20px 40px ${colors.shadow}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `0 10px 30px ${colors.shadow}`;
          }}
        >
          <span style={styles.featureIcon}>💻</span>
          <h3 style={styles.featureTitle}>Premium Web Development</h3>
          <p style={styles.featureText}>
            Cutting-edge websites and applications built with the latest technologies. 
            From responsive design to complex web applications, we deliver excellence.
          </p>
        </div>
        
        <div 
          style={styles.feature}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.boxShadow = `0 20px 40px ${colors.shadow}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `0 10px 30px ${colors.shadow}`;
          }}
        >
          <span style={styles.featureIcon}>🛡️</span>
          <h3 style={styles.featureTitle}>Secure & Reliable</h3>
          <p style={styles.featureText}>
            Enterprise-grade security and rock-solid reliability. Your data is protected 
            with industry-leading encryption and security practices.
          </p>
        </div>
        
        <div 
          style={styles.feature}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.boxShadow = `0 20px 40px ${colors.shadow}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `0 10px 30px ${colors.shadow}`;
          }}
        >
          <span style={styles.featureIcon}>⚡</span>
          <h3 style={styles.featureTitle}>Lightning Fast Delivery</h3>
          <p style={styles.featureText}>
            Quick turnaround times without compromising quality. We understand the 
            importance of speed in today's competitive market.
          </p>
        </div>
      </div>

      <div style={styles.testimonial}>
        <div style={styles.testimonialQuote}>"</div>
        <p style={styles.testimonialText}>
          "The team delivered exactly what we needed. Professional, fast, and the results exceeded our expectations. 
          Our website traffic increased by 300% within the first month!"
        </p>
        <p style={styles.testimonialAuthor}>— Sarah Johnson, CEO at TechCorp Nigeria</p>
      </div>
    </div>
  );
};

export default Home;
