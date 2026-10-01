import { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    const colors = {
      pending: '#f39c12',
      processing: '#3498db',
      completed: '#27ae60',
      cancelled: '#e74c3c',
    };
    return colors[status] || '#95a5a6';
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
          <h2 style={styles.emptyTitle}>No orders yet</h2>
          <p style={styles.emptyText}>
            You haven't placed any orders. Browse our services to get started!
          </p>
          <a href="/products" style={styles.browseButton}>
            Browse Services
          </a>
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
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              <div style={styles.orderItems}>
                <h4 style={styles.itemsTitle}>Items:</h4>
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
  loading: {
    textAlign: 'center',
    padding: '4rem',
    fontSize: '1.2rem',
    color: '#666',
  },
  error: {
    textAlign: 'center',
    padding: '2rem',
    color: '#c33',
    backgroundColor: '#fee',
    borderRadius: '10px',
    margin: '2rem auto',
    maxWidth: '600px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  emptyTitle: {
    fontSize: '2rem',
    color: '#1a1a2e',
    marginBottom: '1rem',
  },
  emptyText: {
    color: '#666',
    fontSize: '1.1rem',
    marginBottom: '2rem',
  },
  browseButton: {
    display: 'inline-block',
    backgroundColor: '#16c79a',
    color: '#fff',
    padding: '1rem 2rem',
    borderRadius: '5px',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: '500',
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  orderCard: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  orderId: {
    fontSize: '1.5rem',
    color: '#1a1a2e',
    marginBottom: '0.25rem',
  },
  orderDate: {
    color: '#666',
    fontSize: '0.9rem',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  orderItems: {
    borderTop: '1px solid #eee',
    borderBottom: '1px solid #eee',
    padding: '1.5rem 0',
    marginBottom: '1.5rem',
  },
  itemsTitle: {
    fontSize: '1.1rem',
    color: '#1a1a2e',
    marginBottom: '1rem',
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0',
    gap: '1rem',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    color: '#333',
    fontWeight: '500',
    marginBottom: '0.25rem',
  },
  itemQuantity: {
    color: '#666',
    fontSize: '0.9rem',
  },
  itemPrice: {
    color: '#16c79a',
    fontWeight: '600',
    fontSize: '1.1rem',
  },
  orderFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: '1.25rem',
    color: '#333',
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: '1.75rem',
    color: '#1a1a2e',
    fontWeight: 'bold',
  },
};

export default Orders;
