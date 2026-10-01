import { Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  const { colors } = useTheme();

  const styles = {
    layout: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: colors.background,
      transition: 'background-color 0.3s ease',
    },
    main: {
      flex: '1',
      backgroundColor: colors.background,
    },
    footer: {
      backgroundColor: colors.secondary,
      color: '#fff',
      padding: '2rem 0',
      marginTop: 'auto',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem',
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.layout}>
      <Navbar />
      <main style={styles.main}>
        <Outlet />
      </main>
      <footer style={styles.footer}>
        <div style={styles.container}>
          <p>&copy; 2024 Professional Services Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
