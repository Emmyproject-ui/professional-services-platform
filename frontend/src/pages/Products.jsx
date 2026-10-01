import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProducts, setSelectedProducts] = useState({});

  const { isAuthenticated } = useAuth();
  const { colors } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    if (quantity > 0) {
      setSelectedProducts({
        ...selectedProducts,
        [productId]: parseInt(quantity),
      });
    } else {
      const updated = { ...selectedProducts };
      delete updated[productId];
      setSelectedProducts(updated);
    }
  };

  const handleAddToCart = (productId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSelectedProducts({
      ...selectedProducts,
      [productId]: 1,
    });
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const items = Object.entries(selectedProducts).map(([productId, quantity]) => ({
      product_id: parseInt(productId),
      quantity,
    }));

    if (items.length === 0) {
      alert('Please select at least one service');
      return;
    }

    navigate('/checkout', { state: { items, products } });
  };

  const getTotalItems = () => {
    return Object.values(selectedProducts).reduce((sum, qty) => sum + qty, 0);
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1rem',
    },
    header: {
      textAlign: 'center',
      marginBottom: '2.5rem',
    },
    title: {
      fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
      color: colors.text,
      marginBottom: '0.5rem',
      fontWeight: '800',
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
    },
    cartSummary: {
      backgroundColor: colors.primary,
      color: '#fff',
      padding: '1.2rem 1.5rem',
      borderRadius: '12px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      gap: '1rem',
      boxShadow: `0 8px 20px ${colors.primary}40`,
    },
    cartText: {
      fontSize: '1.1rem',
      fontWeight: '600',
    },
    checkoutButton: {
      backgroundColor: '#fff',
      color: colors.primary,
      padding: '0.75rem 1.5rem',
      borderRadius: '25px',
      border: 'none',
      fontSize: '1rem',
      fontWeight: '700',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      transition: 'transform 0.2s ease',
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '1.75rem',
    },
    productCard: {
      backgroundColor: colors.surface,
      padding: '2rem',
      borderRadius: '16px',
      boxShadow: `0 8px 24px ${colors.shadow}`,
      display: 'flex',
      flexDirection: 'column',
      border: `1px solid ${colors.border}`,
      transition: 'all 0.3s ease',
    },
    productTitle: {
      fontSize: '1.35rem',
      color: colors.text,
      marginBottom: '0.75rem',
      fontWeight: '700',
    },
    productDescription: {
      color: colors.textSecondary,
      lineHeight: '1.6',
      marginBottom: '1.25rem',
      flex: 1,
      fontSize: '0.95rem',
    },
    productPrice: {
      fontSize: '1.6rem',
      color: colors.primary,
      fontWeight: '800',
      marginBottom: '1.25rem',
    },
    productActions: {
      marginTop: 'auto',
    },
    addButton: {
      width: '100%',
      backgroundColor: colors.primary,
      color: '#fff',
      padding: '0.85rem',
      borderRadius: '10px',
      border: 'none',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: `0 4px 14px ${colors.primary}35`,
      transition: 'all 0.2s ease',
    },
    quantityControl: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1rem',
    },
    quantityButton: {
      backgroundColor: colors.secondary,
      color: '#fff',
      width: '42px',
      height: '42px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '1.4rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    quantity: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      minWidth: '40px',
      textAlign: 'center',
      color: colors.text,
    },
    loading: {
      textAlign: 'center',
      padding: '4rem',
      fontSize: '1.2rem',
      color: colors.textSecondary,
    },
    error: {
      textAlign: 'center',
      padding: '2rem',
      color: colors.error,
      backgroundColor: colors.error + '15',
      borderRadius: '10px',
      margin: '2rem auto',
      maxWidth: '600px',
    },
    emptyState: {
      textAlign: 'center',
      padding: '4rem',
      color: colors.textSecondary,
      fontSize: '1.1rem',
    },
  };

  if (loading) {
    return <div style={styles.loading}>Loading services...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Our Professional Services</h1>
        <p style={styles.subtitle}>Browse and select from our range of professional digital services</p>
      </div>

      {getTotalItems() > 0 && (
        <div style={styles.cartSummary}>
          <span style={styles.cartText}>
            Selected: {getTotalItems()} item(s)
          </span>
          <button onClick={handleCheckout} style={styles.checkoutButton}>
            Proceed to Checkout ➔
          </button>
        </div>
      )}

      <div style={styles.productsGrid}>
        {products.map((product) => (
          <div 
            key={product.id} 
            style={styles.productCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = `0 12px 30px ${colors.shadow}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 8px 24px ${colors.shadow}`;
            }}
          >
            <h3 style={styles.productTitle}>{product.title}</h3>
            <p style={styles.productDescription}>{product.description}</p>
            <p style={styles.productPrice}>
              ₦{parseFloat(product.price).toLocaleString()}
            </p>

            <div style={styles.productActions}>
              {selectedProducts[product.id] ? (
                <div style={styles.quantityControl}>
                  <button
                    onClick={() =>
                      handleQuantityChange(product.id, selectedProducts[product.id] - 1)
                    }
                    style={styles.quantityButton}
                  >
                    -
                  </button>
                  <span style={styles.quantity}>{selectedProducts[product.id]}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(product.id, selectedProducts[product.id] + 1)
                    }
                    style={styles.quantityButton}
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleAddToCart(product.id)}
                  style={styles.addButton}
                >
                  Select Service
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div style={styles.emptyState}>
          <p>No services available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default Products;
