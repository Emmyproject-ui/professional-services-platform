import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';

const AdminDashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const { colors } = useTheme();

  useEffect(() => {
    fetchDashboardData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, ordersResponse] = await Promise.all([
        adminAPI.getStatistics(),
        adminAPI.getAllOrders(),
      ]);

      if (statsResponse.data.success) {
        setStatistics(statsResponse.data.data);
      }

      if (ordersResponse.data.success) {
        setOrders(ordersResponse.data.data);
      }

      setLastUpdate(new Date());
      setError('');
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (!window.confirm(`Change order status to "${newStatus}"?`)) {
      return;
    }

    setUpdatingOrderId(orderId);

    try {
      const response = await adminAPI.updateOrderStatus(orderId, newStatus);

      if (response.data.success) {
        // Update the order in the list
        setOrders(
          orders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );

        // Refresh statistics
        const statsResponse = await adminAPI.getStatistics();
        if (statsResponse.data.success) {
          setStatistics(statsResponse.data.data);
        }

        // Show success notification
        const notification = document.createElement('div');
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: ${colors.success};
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        notification.textContent = '✅ Order status updated successfully';
        document.body.appendChild(notification);

        setTimeout(() => {
          document.body.removeChild(notification);
        }, 3000);
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update order status';
      alert(message);
      console.error(err);
    } finally {
      setUpdatingOrderId(null);
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

  const styles = {
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '2rem 1rem',
      backgroundColor: colors.background,
      minHeight: '100vh',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
    },
    title: {
      fontSize: '2.5rem',
      color: colors.text,
      marginBottom: '0.5rem',
    },
    lastUpdate: {
      fontSize: '0.9rem',
      color: colors.textSecondary,
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    refreshButton: {
      backgroundColor: colors.primary,
      color: '#fff',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '0.9rem',
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
      backgroundColor: colors.error + '20',
      borderRadius: '10px',
      margin: '2rem auto',
      maxWidth: '600px',
      border: `1px solid ${colors.error}40`,
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.5rem',
      marginBottom: '3rem',
    },
    statCard: {
      backgroundColor: colors.surface,
      padding: '2rem',
      borderRadius: '10px',
      boxShadow: `0 2px 8px ${colors.shadow}`,
      textAlign: 'center',
      transition: 'transform 0.2s ease',
    },
    totalCard: {
      borderTop: `4px solid ${colors.secondary}`,
    },
    pendingCard: {
      borderTop: '4px solid #f39c12',
    },
    processingCard: {
      borderTop: '4px solid #3498db',
    },
    completedCard: {
      borderTop: '4px solid #27ae60',
    },
    cancelledCard: {
      borderTop: '4px solid #e74c3c',
    },
    statValue: {
      fontSize: '2.5rem',
      color: colors.text,
      marginBottom: '0.5rem',
      fontWeight: 'bold',
    },
    statLabel: {
      color: colors.textSecondary,
      fontSize: '1rem',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    tableSection: {
      backgroundColor: colors.surface,
      padding: '2rem',
      borderRadius: '10px',
      boxShadow: `0 2px 8px ${colors.shadow}`,
    },
    sectionTitle: {
      fontSize: '1.75rem',
      color: colors.text,
      marginBottom: '1.5rem',
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem',
      color: colors.textSecondary,
      fontSize: '1.1rem',
    },
    tableWrapper: {
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    tableHeader: {
      backgroundColor: colors.background,
    },
    th: {
      padding: '1rem',
      textAlign: 'left',
      fontWeight: '600',
      color: colors.text,
      borderBottom: `2px solid ${colors.border}`,
      whiteSpace: 'nowrap',
    },
    tableRow: {
      borderBottom: `1px solid ${colors.border}`,
      transition: 'background-color 0.2s ease',
    },
    td: {
      padding: '1rem',
      color: colors.text,
      verticalAlign: 'top',
    },
    productsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
    },
    productItem: {
      fontSize: '0.9rem',
      color: colors.textSecondary,
    },
    statusBadge: {
      display: 'inline-block',
      padding: '0.35rem 0.75rem',
      borderRadius: '15px',
      color: '#fff',
      fontSize: '0.85rem',
      fontWeight: '600',
      whiteSpace: 'nowrap',
    },
    statusSelect: {
      padding: '0.5rem',
      borderRadius: '5px',
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.surface,
      color: colors.text,
      cursor: 'pointer',
      fontSize: '0.9rem',
    },
  };

  if (loading) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <div style={styles.lastUpdate}>
            🔄 Last updated: {formatDate(lastUpdate)}
            <button onClick={fetchDashboardData} style={styles.refreshButton}>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div style={styles.statsGrid}>
          <div style={{ ...styles.statCard, ...styles.totalCard }}>
            <h3 style={styles.statValue}>{statistics.total_orders}</h3>
            <p style={styles.statLabel}>Total Orders</p>
          </div>
          <div style={{ ...styles.statCard, ...styles.pendingCard }}>
            <h3 style={styles.statValue}>{statistics.pending_orders}</h3>
            <p style={styles.statLabel}>Pending</p>
          </div>
          <div style={{ ...styles.statCard, ...styles.processingCard }}>
            <h3 style={styles.statValue}>{statistics.processing_orders}</h3>
            <p style={styles.statLabel}>Processing</p>
          </div>
          <div style={{ ...styles.statCard, ...styles.completedCard }}>
            <h3 style={styles.statValue}>{statistics.completed_orders}</h3>
            <p style={styles.statLabel}>Completed</p>
          </div>
          <div style={{ ...styles.statCard, ...styles.cancelledCard }}>
            <h3 style={styles.statValue}>{statistics.cancelled_orders}</h3>
            <p style={styles.statLabel}>Cancelled</p>
          </div>
        </div>
      )}

      {/* Orders Management Table */}
      <div style={styles.tableSection}>
        <h2 style={styles.sectionTitle}>
          Order Management 
          <span style={{ fontSize: '1rem', fontWeight: 'normal', color: colors.textSecondary }}>
            ({orders.length} orders)
          </span>
        </h2>

        {orders.length === 0 ? (
          <div style={styles.emptyState}>No orders found</div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Order ID</th>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Products/Services</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} style={styles.tableRow}>
                    <td style={styles.td}>#{order.id}</td>
                    <td style={styles.td}>{order.customer_name}</td>
                    <td style={styles.td}>{order.customer_email}</td>
                    <td style={styles.td}>
                      <div style={styles.productsList}>
                        {order.product_details.map((item, index) => (
                          <div key={index} style={styles.productItem}>
                            {item.title} (x{item.quantity})
                          </div>
                        ))}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <strong>₦{parseFloat(order.total_amount).toLocaleString()}</strong>
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: getStatusColor(order.status),
                        }}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td style={styles.td}>{formatDate(order.created_at)}</td>
                    <td style={styles.td}>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={updatingOrderId === order.id}
                        style={styles.statusSelect}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
