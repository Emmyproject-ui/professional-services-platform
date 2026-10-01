import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const PasswordInput = ({ value, onChange, placeholder, required, style, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { colors } = useTheme();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputStyles = {
    ...style,
    paddingRight: '45px',
    backgroundColor: colors.surface,
    color: colors.text,
    border: `1px solid ${colors.border}`,
  };

  const containerStyles = {
    position: 'relative',
    display: 'inline-block',
    width: '100%',
  };

  const buttonStyles = {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: colors.textSecondary,
    fontSize: '16px',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={containerStyles}>
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={inputStyles}
        {...props}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        style={buttonStyles}
        title={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? (
          // Eye slash icon (hide)
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
          </svg>
        ) : (
          // Eye icon (show)
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
        )}
      </button>
    </div>
  );
};

export default PasswordInput;