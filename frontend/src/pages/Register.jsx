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
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handlePasswordChange = (e, field) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
    if (errors[field] || errors.password_confirmation) {
      setErrors({ ...errors, [field]: null, password_confirmation: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');

    // Client-side pre-validation
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    }
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    if (formData.password !== formData.passwordConfirmation) {
      newErrors.passwordConfirmation = 'Password confirmation does not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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
      }, 1500);
    } else {
      if (result.errors) {
        // Normalize snake_case keys from backend to camelCase if needed
        const mappedErrors = { ...result.errors };
        if (result.errors.password_confirmation) {
          mappedErrors.passwordConfirmation = result.errors.password_confirmation;
        }
        setErrors(mappedErrors);
      }
      setMessage(result.message || 'Registration failed. Please check the form.');
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
      padding: '2.25rem 2rem',
      borderRadius: '16px',
      boxShadow: `0 8px 24px ${colors.shadow}`,
      border: `1px solid ${colors.border}`,
      transition: 'all 0.3s ease',
    },
    title: {
      fontSize: '2rem',
      color: colors.text,
      marginBottom: '0.5rem',
      textAlign: 'center',
      fontWeight: '800',
    },
    subtitle: {
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: '2rem',
      fontSize: '0.95rem',
    },
    errorBanner: {
      backgroundColor: colors.error + '15',
      color: colors.error,
      padding: '0.9rem 1.25rem',
      borderRadius: '10px',
      marginBottom: '1.25rem',
      border: `1px solid ${colors.error}40`,
      fontSize: '0.95rem',
      fontWeight: '500',
    },
    successBanner: {
      backgroundColor: colors.success + '15',
      color: colors.success,
      padding: '0.9rem 1.25rem',
      borderRadius: '10px',
      marginBottom: '1.25rem',
      border: `1px solid ${colors.success}40`,
      fontSize: '0.95rem',
      fontWeight: '600',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.4rem',
    },
    label: {
      color: colors.text,
      fontWeight: '600',
      fontSize: '0.95rem',
    },
    input: {
      padding: '0.85rem 1rem',
      border: `1px solid ${colors.border}`,
      borderRadius: '10px',
      fontSize: '1rem',
      backgroundColor: colors.surface,
      color: colors.text,
      transition: 'border-color 0.2s ease',
      width: '100%',
    },
    fieldError: {
      color: colors.error,
      fontSize: '0.85rem',
      marginTop: '0.2rem',
      fontWeight: '500',
    },
    button: {
      backgroundColor: colors.primary,
      color: '#fff',
      padding: '1rem',
      borderRadius: '25px',
      border: 'none',
      fontSize: '1.05rem',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: `0 4px 14px ${colors.primary}40`,
      marginTop: '0.5rem',
      opacity: loading ? 0.7 : 1,
    },
    footer: {
      textAlign: 'center',
      marginTop: '1.5rem',
      color: colors.textSecondary,
      fontSize: '0.95rem',
    },
    link: {
      color: colors.primary,
      textDecoration: 'none',
      fontWeight: '600',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join our platform to access professional services</p>

        {message && (
          <div style={message.includes('successful') ? styles.successBanner : styles.errorBanner}>
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
              style={{
                ...styles.input,
                ...(errors.name ? { borderColor: colors.error } : {})
              }}
              placeholder="Enter your full name"
            />
            {errors.name && <span style={styles.fieldError}>{errors.name}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                ...styles.input,
                ...(errors.email ? { borderColor: colors.error } : {})
              }}
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
              style={{
                ...styles.input,
                ...(errors.password ? { borderColor: colors.error } : {})
              }}
              placeholder="Min. 8 characters"
            />
            {errors.password && <span style={styles.fieldError}>{errors.password}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <PasswordInput
              value={formData.passwordConfirmation}
              onChange={(e) => handlePasswordChange(e, 'passwordConfirmation')}
              required
              style={{
                ...styles.input,
                ...(errors.passwordConfirmation ? { borderColor: colors.error } : {})
              }}
              placeholder="Re-enter your password"
            />
            {errors.passwordConfirmation && (
              <span style={styles.fieldError}>{errors.passwordConfirmation}</span>
            )}
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Creating Account...' : 'Register Account'}
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
