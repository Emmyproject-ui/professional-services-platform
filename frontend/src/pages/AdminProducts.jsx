import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', price: '', status: 'active' });

  const { colors } = useTheme();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // We'll need to create a new admin endpoint for all products
      const response = await api.get('/admin/products.php');
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (err) {
      // Fallback to public endpoint for now
      const response = await api.get('/products/index.php');
      if (response.data.success) {
        setProducts(response.data.data);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setEditForm({
      title: product.title,
      description: product.description,
      price: product.price,
      status: product.status
    });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditForm({ title: '', description: '', price: '', status: 'active' });
  };

  const handleSave = async (productId) => {
    try {
      const response = await api.put(`/admin/products.php/${productId}`, editForm);
      if (response.data.success) {
        // Update the product in the list
        setProducts(products.map(product => 
          product.id === productId 
            ? { ...product, ...editForm, price: parseFloat(editForm.price) }
            : product
        ));
        
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
        notification.textContent = '✅ Product updated successfully';
        document.body.appendChild(notification);

        setTimeout(() => {
          document.body.removeChild(notification);
        }, 3000);

        handleCancelEdit();
      }
    } catch (err) {
      alert('Failed to update product: ' + (err.response?.data?.message || err.message));
    }
  };

  const styles = {
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '2rem 1rem',
      backgroundColor: colors.background,
      minHeight: '100vh',
    },
    title: {
      fontSize: '2.5rem',
      color: colors.text,
      marginBottom: '2rem',
    },
    tableContainer: {
      backgroundColor: colors.surface,
      padding: '2rem',
      borderRadius: '10px',
      boxShadow: `0 2px 8px ${colors.shadow}`,
      overflow: 'hidden',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      padding: '1rem',
      textAlign: 'left',
      fontWeight: '600',
      color: colors.text,
      borderBottom: `2px solid ${colors.border}`,
      backgroundColor: colors.background,
    },
    tr: {
      borderBottom: `1px solid ${colors.border}`,
    },
    td: {
      padding: '1rem',
      color: colors.text,
      verticalAlign: 'top',
    },
    input: {
      width: '100%',
      padding: '0.5rem',
      border: `1px solid ${colors.border}`,
      borderRadius: '5px',
      backgroundColor: colors.surface,
      color: colors.text,
      fontSize: '0.9rem',
    },
    textarea: {
      width: '100%',
      padding: '0.5rem',
      border: `1px solid ${colors.border}`,
      borderRadius: '5px',
      backgroundColor: colors.surface,
      color: colors.text,
      fontSize: '0.9rem',
      minHeight: '60px',
      resize: 'vertical',
    },
    select: {
      width: '100%',
      padding: '0.5rem',
      border: `1px solid ${colors.border}`,
      borderRadius: '5px',
      backgroundColor: colors.surface,
      color: colors.text,
      fontSize: '0.9rem',
    },
    editButton: {
      backgroundColor: colors.primary,
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '5px',
      cursor: 'pointer',
      marginRight: '0.5rem',
      fontSize: '0.9rem',
    },
    saveButton: {
      backgroundColor: colors.success,
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '5px',
      cursor: 'pointer',
      marginRight: '0.5rem',
      fontSize: '0.9rem',
    },
    cancelButton: {
      backgroundColor: colors.textSecondary,
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '0.9rem',
    },
    statusBadge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '15px',
      fontSize: '0.8rem',
      fontWeight: '600',
      color: 'white',
    },
    activeStatus: {
      backgroundColor: colors.success,
    },
    inactiveStatus: {
      backgroundColor: colors.textSecondary,
    },
    price: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: colors.primary,
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
  };

  if (loading) {
    return <div style={styles.loading}>Loading products...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Manage Products</h1>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Price (₦)</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} style={styles.tr}>
                <td style={styles.td}>{product.id}</td>
                <td style={styles.td}>
                  {editingProduct === product.id ? (
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                      style={styles.input}
                    />
                  ) : (
                    product.title
                  )}
                </td>
                <td style={styles.td}>
                  {editingProduct === product.id ? (
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      style={styles.textarea}
                    />
                  ) : (
                    product.description
                  )}
                </td>
                <td style={styles.td}>
                  {editingProduct === product.id ? (
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                      style={styles.input}
                      min="0"
                      step="1000"
                    />
                  ) : (
                    <span style={styles.price}>₦{parseFloat(product.price).toLocaleString()}</span>
                  )}
                </td>
                <td style={styles.td}>
                  {editingProduct === product.id ? (
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                      style={styles.select}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  ) : (
                    <span 
                      style={{
                        ...styles.statusBadge,
                        ...(product.status === 'active' ? styles.activeStatus : styles.inactiveStatus)
                      }}
                    >
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </span>
                  )}
                </td>
                <td style={styles.td}>
                  {editingProduct === product.id ? (
                    <>
                      <button onClick={() => handleSave(product.id)} style={styles.saveButton}>
                        Save
                      </button>
                      <button onClick={handleCancelEdit} style={styles.cancelButton}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button onClick={() => handleEdit(product)} style={styles.editButton}>
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;