import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import PasswordInput from '../components/PasswordInput';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { colors } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      // Redirect based on role
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/products');
      }
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  const styles = {
    container: {
      maxWidth: '500px',
      margin: '3rem auto',
      padding: '0 1rem',
    },
    formCard: {
      backgroundColor: colors.surface,
      padding: '2rem',
      borderRadius: '10px',
      boxShadow: `0 2px 8px ${colors.shadow}`,
      transition: 'all 0.3s ease',
    },
    title: {
      fontSize: '2rem',
      color: colors.text,
      marginBottom: '0.5rem',
      textAlign: 'center',
    },
    subtitle: {
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: '2rem',
    },
    error: {
      backgroundColor: colors.error + '20',
      color: colors.error,
      padding: '1rem',
      borderRadius: '5px',
      marginBottom: '1rem',
      border: `1px solid ${colors.error}40`,
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    label: {
      color: colors.text,
      fontWeight: '500',
    },
    input: {
      padding: '0.75rem',
      border: `1px solid ${colors.border}`,
      borderRadius: '5px',
      fontSize: '1rem',
      backgroundColor: colors.surface,
      color: colors.text,
      transition: 'border-color 0.3s ease',
    },
    button: {
      backgroundColor: colors.primary,
      color: '#fff',
      padding: '1rem',
      borderRadius: '5px',
      border: 'none',
      fontSize: '1.1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      opacity: loading ? 0.7 : 1,
    },
    footer: {
      textAlign: 'center',
      marginTop: '1.5rem',
      color: colors.textSecondary,
    },
    link: {
      color: colors.primary,
      textDecoration: 'none',
      fontWeight: '500',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={styles.title}>Login</h2>
        <p style={styles.subtitle}>Welcome back! Please login to your account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your email"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
