import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ordersAPI } from '../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, products } = location.state || {};

  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!items || !products) {
      navigate('/products');
      return;
    }

    // Build order items with product details
    const itemsWithDetails = items.map((item) => {
      const product = products.find((p) => p.id === item.product_id);
      return {
        ...item,
        product,
        lineTotal: product.price * item.quantity,
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
        // Order created successfully
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
    return null; // Will redirect via useEffect
  }

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
                  <h3 style={styles.itemTitle}>{item.product.title}</h3>
                  <p style={styles.itemDescription}>{item.product.description}</p>
                </div>
                <div style={styles.itemPricing}>
                  <p style={styles.itemQuantity}>Qty: {item.quantity}</p>
                  <p style={styles.itemPrice}>
                    ₦{parseFloat(item.product.price).toLocaleString()} each
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
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>

          <button onClick={() => navigate('/products')} style={styles.backButton}>
            Back to Services
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  title: {
    fontSize: '2.5rem',
    color: '#1a1a2e',
    marginBottom: '2rem',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '1rem',
    borderRadius: '5px',
    marginBottom: '1rem',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '2rem',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  orderSummary: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '1.75rem',
    color: '#1a1a2e',
    marginBottom: '1.5rem',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  item: {
    padding: '1.5rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
  itemDetails: {
    marginBottom: '1rem',
  },
  itemTitle: {
    fontSize: '1.25rem',
    color: '#1a1a2e',
    marginBottom: '0.5rem',
  },
  itemDescription: {
    color: '#666',
    fontSize: '0.9rem',
  },
  itemPricing: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  itemQuantity: {
    color: '#666',
  },
  itemPrice: {
    color: '#666',
  },
  itemTotal: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#16c79a',
  },
  totalSection: {
    marginTop: '2rem',
    paddingTop: '2rem',
    borderTop: '2px solid #ddd',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: '1.5rem',
    color: '#1a1a2e',
  },
  totalAmount: {
    fontSize: '2rem',
    color: '#16c79a',
    fontWeight: 'bold',
  },
  actionSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  infoTitle: {
    fontSize: '1.25rem',
    color: '#1a1a2e',
    marginBottom: '1rem',
  },
  infoText: {
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '0.75rem',
  },
  placeOrderButton: {
    backgroundColor: '#16c79a',
    color: '#fff',
    padding: '1rem',
    borderRadius: '5px',
    border: 'none',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  backButton: {
    backgroundColor: '#fff',
    color: '#1a1a2e',
    padding: '1rem',
    borderRadius: '5px',
    border: '2px solid #1a1a2e',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
};

export default Checkout;
