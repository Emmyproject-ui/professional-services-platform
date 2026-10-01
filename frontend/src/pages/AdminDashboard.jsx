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
        setOrders(
          orders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );

        const statsResponse = await adminAPI.getStatistics();
        if (statsResponse.data.success) {
          setStatistics(statsResponse.data.data);
        }

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
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
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
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '2rem 1rem',
      minHeight: '100vh',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    title: {
      fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
      color: colors.text,
      marginBottom: '0.5rem',
      fontWeight: '800',
    },
    lastUpdate: {
      fontSize: '0.9rem',
      color: colors.textSecondary,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      flexWrap: 'wrap',
    },
    refreshButton: {
      backgroundColor: colors.primary,
      color: '#fff',
      border: 'none',
      padding: '0.4rem 1rem',
      borderRadius: '20px',
      cursor: 'pointer',
      fontSize: '0.85rem',
      fontWeight: '600',
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
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '1.25rem',
      marginBottom: '2.5rem',
    },
    statCard: {
      backgroundColor: colors.surface,
      padding: '1.75rem 1.25rem',
      borderRadius: '16px',
      boxShadow: `0 8px 24px ${colors.shadow}`,
      textAlign: 'center',
      border: `1px solid ${colors.border}`,
      transition: 'transform 0.2s ease',
    },
    statValue: {
      fontSize: '2.2rem',
      color: colors.text,
      marginBottom: '0.4rem',
      fontWeight: '800',
    },
    statLabel: {
      color: colors.textSecondary,
      fontSize: '0.9rem',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: '600',
    },
    tableSection: {
      backgroundColor: colors.surface,
      padding: '1.75rem',
      borderRadius: '16px',
      boxShadow: `0 8px 24px ${colors.shadow}`,
      border: `1px solid ${colors.border}`,
    },
    sectionTitle: {
      fontSize: '1.5rem',
      color: colors.text,
      marginBottom: '1.25rem',
      fontWeight: '700',
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem',
      color: colors.textSecondary,
      fontSize: '1.1rem',
    },
    tableWrapper: {
      width: '100%',
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '750px',
    },
    tableHeader: {
      backgroundColor: colors.background,
    },
    th: {
      padding: '1rem 0.85rem',
      textAlign: 'left',
      fontWeight: '700',
      color: colors.text,
      borderBottom: `2px solid ${colors.border}`,
      whiteSpace: 'nowrap',
      fontSize: '0.9rem',
    },
    tableRow: {
      borderBottom: `1px solid ${colors.border}`,
      transition: 'background-color 0.2s ease',
    },
    td: {
      padding: '1rem 0.85rem',
      color: colors.text,
      verticalAlign: 'middle',
      fontSize: '0.9rem',
    },
    productsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
    },
    productItem: {
      fontSize: '0.85rem',
      color: colors.textSecondary,
    },
    statusBadge: {
      display: 'inline-block',
      padding: '0.35rem 0.75rem',
      borderRadius: '15px',
      color: '#fff',
      fontSize: '0.8rem',
      fontWeight: '700',
      whiteSpace: 'nowrap',
    },
    statusSelect: {
      padding: '0.45rem 0.65rem',
      borderRadius: '8px',
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.surface,
      color: colors.text,
      cursor: 'pointer',
      fontSize: '0.85rem',
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
          <div style={{ ...styles.statCard, borderTop: `4px solid ${colors.primary}` }}>
            <h3 style={styles.statValue}>{statistics.total_orders}</h3>
            <p style={styles.statLabel}>Total Orders</p>
          </div>
          <div style={{ ...styles.statCard, borderTop: `4px solid ${colors.warning}` }}>
            <h3 style={styles.statValue}>{statistics.pending_orders}</h3>
            <p style={styles.statLabel}>Pending</p>
          </div>
          <div style={{ ...styles.statCard, borderTop: '4px solid #3498db' }}>
            <h3 style={styles.statValue}>{statistics.processing_orders}</h3>
            <p style={styles.statLabel}>Processing</p>
          </div>
          <div style={{ ...styles.statCard, borderTop: `4px solid ${colors.success}` }}>
            <h3 style={styles.statValue}>{statistics.completed_orders}</h3>
            <p style={styles.statLabel}>Completed</p>
          </div>
          <div style={{ ...styles.statCard, borderTop: `4px solid ${colors.error}` }}>
            <h3 style={styles.statValue}>{statistics.cancelled_orders}</h3>
            <p style={styles.statLabel}>Cancelled</p>
          </div>
        </div>
      )}

      {/* Orders Management Table */}
      <div style={styles.tableSection}>
        <h2 style={styles.sectionTitle}>
          Order Management 
          <span style={{ fontSize: '0.95rem', fontWeight: 'normal', color: colors.textSecondary, marginLeft: '0.5rem' }}>
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
                        {order.status}
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
