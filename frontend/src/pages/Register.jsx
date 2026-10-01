import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import PasswordInput from '../components/PasswordInput';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { colors } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handlePasswordChange = (e, field) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');
    setLoading(true);

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.passwordConfirmation
    );

    if (result.success) {
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      if (result.errors) {
        setErrors(result.errors);
      } else {
        setMessage(result.message);
      }
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
    success: {
      backgroundColor: colors.success + '20',
      color: colors.success,
      padding: '1rem',
      borderRadius: '5px',
      marginBottom: '1rem',
      border: `1px solid ${colors.success}40`,
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
    fieldError: {
      color: colors.error,
      fontSize: '0.875rem',
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
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join our platform to access professional services</p>

        {message && (
          <div style={message.includes('successful') ? styles.success : styles.error}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter your full name"
            />
            {errors.name && <span style={styles.fieldError}>{errors.name}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter your email"
            />
            {errors.email && <span style={styles.fieldError}>{errors.email}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <PasswordInput
              value={formData.password}
              onChange={(e) => handlePasswordChange(e, 'password')}
              required
              style={styles.input}
              placeholder="Enter your password (min 8 characters)"
            />
            {errors.password && <span style={styles.fieldError}>{errors.password}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <PasswordInput
              value={formData.passwordConfirmation}
              onChange={(e) => handlePasswordChange(e, 'passwordConfirmation')}
              required
              style={styles.input}
              placeholder="Confirm your password"
            />
            {errors.password_confirmation && (
              <span style={styles.fieldError}>{errors.password_confirmation}</span>
            )}
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
