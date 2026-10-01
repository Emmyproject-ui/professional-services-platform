import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, products } = location.state || {};

  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { colors } = useTheme();

  useEffect(() => {
    if (!items || !products) {
      navigate('/products');
      return;
    }

    const itemsWithDetails = items.map((item) => {
      const product = products.find((p) => p.id === item.product_id);
      return {
        ...item,
        product,
        lineTotal: (product ? product.price : 0) * item.quantity,
      };
    });

    setOrderItems(itemsWithDetails);
  }, [items, products, navigate]);

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.lineTotal, 0);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await ordersAPI.create({
        items: items,
        total_amount: calculateTotal(),
      });

      if (response.data.success) {
        alert('Order placed successfully!');
        navigate('/orders');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to place order';
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (orderItems.length === 0) {
    return null;
  }

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1rem',
    },
    title: {
      fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
      color: colors.text,
      marginBottom: '2rem',
      fontWeight: '800',
    },
    error: {
      backgroundColor: colors.error + '20',
      color: colors.error,
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1.5rem',
      border: `1px solid ${colors.error}40`,
    },
    content: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '2rem',
    },
    orderSummary: {
      backgroundColor: colors.surface,
      padding: '2rem',
      borderRadius: '16px',
      boxShadow: `0 8px 24px ${colors.shadow}`,
      border: `1px solid ${colors.border}`,
    },
    sectionTitle: {
      fontSize: '1.5rem',
      color: colors.text,
      marginBottom: '1.5rem',
      fontWeight: '700',
    },
    itemsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
    },
    item: {
      padding: '1.25rem',
      backgroundColor: colors.background,
      borderRadius: '12px',
      border: `1px solid ${colors.border}`,
    },
    itemDetails: {
      marginBottom: '0.75rem',
    },
    itemTitle: {
      fontSize: '1.15rem',
      color: colors.text,
      marginBottom: '0.35rem',
      fontWeight: '600',
    },
    itemDescription: {
      color: colors.textSecondary,
      fontSize: '0.9rem',
    },
    itemPricing: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '0.5rem',
      marginTop: '0.75rem',
      paddingTop: '0.75rem',
      borderTop: `1px dashed ${colors.border}`,
    },
    itemQuantity: {
      color: colors.textSecondary,
      fontSize: '0.9rem',
    },
    itemPrice: {
      color: colors.textSecondary,
      fontSize: '0.9rem',
    },
    itemTotal: {
      fontSize: '1.15rem',
      fontWeight: 'bold',
      color: colors.primary,
    },
    totalSection: {
      marginTop: '2rem',
      paddingTop: '1.5rem',
      borderTop: `2px solid ${colors.border}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '0.5rem',
    },
    totalLabel: {
      fontSize: '1.3rem',
      color: colors.text,
      fontWeight: '600',
    },
    totalAmount: {
      fontSize: '1.8rem',
      color: colors.primary,
      fontWeight: '800',
    },
    actionSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
    },
    infoBox: {
      backgroundColor: colors.surface,
      padding: '1.5rem',
      borderRadius: '16px',
      boxShadow: `0 8px 24px ${colors.shadow}`,
      border: `1px solid ${colors.border}`,
    },
    infoTitle: {
      fontSize: '1.2rem',
      color: colors.text,
      marginBottom: '1rem',
      fontWeight: '700',
    },
    infoText: {
      color: colors.textSecondary,
      lineHeight: '1.6',
      marginBottom: '0.75rem',
      fontSize: '0.95rem',
    },
    placeOrderButton: {
      backgroundColor: colors.primary,
      color: '#fff',
      padding: '1rem',
      borderRadius: '25px',
      border: 'none',
      fontSize: '1.1rem',
      fontWeight: '700',
      cursor: 'pointer',
      boxShadow: `0 4px 14px ${colors.primary}40`,
      transition: 'all 0.2s ease',
    },
    backButton: {
      backgroundColor: colors.surface,
      color: colors.text,
      padding: '0.9rem',
      borderRadius: '25px',
      border: `2px solid ${colors.border}`,
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      textAlign: 'center',
      transition: 'all 0.2s ease',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Checkout</h1>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.content}>
        <div style={styles.orderSummary}>
          <h2 style={styles.sectionTitle}>Order Summary</h2>

          <div style={styles.itemsList}>
            {orderItems.map((item, index) => (
              <div key={index} style={styles.item}>
                <div style={styles.itemDetails}>
                  <h3 style={styles.itemTitle}>{item.product?.title}</h3>
                  <p style={styles.itemDescription}>{item.product?.description}</p>
                </div>
                <div style={styles.itemPricing}>
                  <p style={styles.itemQuantity}>Qty: {item.quantity}</p>
                  <p style={styles.itemPrice}>
                    ₦{parseFloat(item.product?.price || 0).toLocaleString()} each
                  </p>
                  <p style={styles.itemTotal}>
                    ₦{parseFloat(item.lineTotal).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.totalSection}>
            <h3 style={styles.totalLabel}>Total Amount:</h3>
            <h3 style={styles.totalAmount}>
              ₦{parseFloat(calculateTotal()).toLocaleString()}
            </h3>
          </div>
        </div>

        <div style={styles.actionSection}>
          <div style={styles.infoBox}>
            <h3 style={styles.infoTitle}>Order Information</h3>
            <p style={styles.infoText}>
              Your order will be processed after confirmation. You can track your order
              status in the "My Orders" section.
            </p>
            <p style={styles.infoText}>
              Payment details will be provided via email after order confirmation.
            </p>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            style={styles.placeOrderButton}
          >
            {loading ? 'Placing Order...' : 'Confirm & Place Order ➔'}
          </button>

          <button onClick={() => navigate('/products')} style={styles.backButton}>
            Back to Services
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
