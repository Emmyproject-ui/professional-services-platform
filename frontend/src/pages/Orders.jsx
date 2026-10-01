import { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { colors } = useTheme();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getMyOrders();
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (err) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: colors.warning,
      processing: '#3498db',
      completed: colors.success,
      cancelled: colors.error,
    };
    return statusColors[status] || '#95a5a6';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
      padding: '4rem 1.5rem',
      backgroundColor: colors.surface,
      borderRadius: '16px',
      boxShadow: `0 8px 24px ${colors.shadow}`,
      border: `1px solid ${colors.border}`,
    },
    emptyTitle: {
      fontSize: '1.8rem',
      color: colors.text,
      marginBottom: '1rem',
    },
    emptyText: {
      color: colors.textSecondary,
      fontSize: '1.1rem',
      marginBottom: '2rem',
    },
    browseButton: {
      display: 'inline-block',
      backgroundColor: colors.primary,
      color: '#fff',
      padding: '0.85rem 2rem',
      borderRadius: '25px',
      textDecoration: 'none',
      fontSize: '1.05rem',
      fontWeight: '600',
      boxShadow: `0 4px 14px ${colors.primary}40`,
    },
    ordersList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    orderCard: {
      backgroundColor: colors.surface,
      padding: '1.75rem',
      borderRadius: '16px',
      boxShadow: `0 8px 24px ${colors.shadow}`,
      border: `1px solid ${colors.border}`,
    },
    orderHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '1.25rem',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    orderId: {
      fontSize: '1.35rem',
      color: colors.text,
      marginBottom: '0.25rem',
      fontWeight: '700',
    },
    orderDate: {
      color: colors.textSecondary,
      fontSize: '0.9rem',
    },
    statusBadge: {
      display: 'inline-block',
      padding: '0.4rem 1rem',
      borderRadius: '20px',
      color: '#fff',
      fontSize: '0.85rem',
      fontWeight: '700',
      textTransform: 'capitalize',
    },
    orderItems: {
      borderTop: `1px solid ${colors.border}`,
      borderBottom: `1px solid ${colors.border}`,
      padding: '1.25rem 0',
      marginBottom: '1.25rem',
    },
    itemsTitle: {
      fontSize: '1.05rem',
      color: colors.text,
      marginBottom: '0.75rem',
      fontWeight: '600',
    },
    orderItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.5rem 0',
      gap: '1rem',
      flexWrap: 'wrap',
    },
    itemInfo: {
      flex: 1,
    },
    itemTitle: {
      color: colors.text,
      fontWeight: '500',
      marginBottom: '0.2rem',
    },
    itemQuantity: {
      color: colors.textSecondary,
      fontSize: '0.9rem',
    },
    itemPrice: {
      color: colors.primary,
      fontWeight: '700',
      fontSize: '1.1rem',
    },
    orderFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '0.5rem',
    },
    totalLabel: {
      fontSize: '1.1rem',
      color: colors.textSecondary,
      fontWeight: '500',
    },
    totalAmount: {
      fontSize: '1.5rem',
      color: colors.text,
      fontWeight: '800',
    },
  };

  if (loading) {
    return <div style={styles.loading}>Loading your orders...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Orders</h1>

      {orders.length === 0 ? (
        <div style={styles.emptyState}>
          <h2 style={styles.emptyTitle}>No orders placed yet</h2>
          <p style={styles.emptyText}>
            You haven't placed any orders yet. Browse our professional services to get started!
          </p>
          <Link to="/products" style={styles.browseButton}>
            Browse Services ➔
          </Link>
        </div>
      ) : (
        <div style={styles.ordersList}>
          {orders.map((order) => (
            <div key={order.id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <div>
                  <h3 style={styles.orderId}>Order #{order.id}</h3>
                  <p style={styles.orderDate}>{formatDate(order.created_at)}</p>
                </div>
                <div>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(order.status),
                    }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div style={styles.orderItems}>
                <h4 style={styles.itemsTitle}>Purchased Services:</h4>
                {order.product_details.map((item, index) => (
                  <div key={index} style={styles.orderItem}>
                    <div style={styles.itemInfo}>
                      <p style={styles.itemTitle}>{item.title}</p>
                      <p style={styles.itemQuantity}>Quantity: {item.quantity}</p>
                    </div>
                    <p style={styles.itemPrice}>
                      ₦{parseFloat(item.line_total).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div style={styles.orderFooter}>
                <span style={styles.totalLabel}>Total Amount:</span>
                <span style={styles.totalAmount}>
                  ₦{parseFloat(order.total_amount).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
