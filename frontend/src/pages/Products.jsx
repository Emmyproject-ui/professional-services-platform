import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProducts, setSelectedProducts] = useState({});

  const { isAuthenticated } = useAuth();
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
        <p style={styles.subtitle}>Browse and select from our range of professional services</p>
      </div>

      {getTotalItems() > 0 && (
        <div style={styles.cartSummary}>
          <span style={styles.cartText}>
            Selected: {getTotalItems()} item(s)
          </span>
          <button onClick={handleCheckout} style={styles.checkoutButton}>
            Proceed to Checkout
          </button>
        </div>
      )}

      <div style={styles.productsGrid}>
        {products.map((product) => (
          <div key={product.id} style={styles.productCard}>
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

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2.5rem',
    color: '#1a1a2e',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#666',
    fontSize: '1.1rem',
  },
  cartSummary: {
    backgroundColor: '#16c79a',
    color: '#fff',
    padding: '1rem',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  cartText: {
    fontSize: '1.1rem',
    fontWeight: '500',
  },
  checkoutButton: {
    backgroundColor: '#fff',
    color: '#16c79a',
    padding: '0.75rem 1.5rem',
    borderRadius: '5px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem',
  },
  productCard: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  productTitle: {
    fontSize: '1.5rem',
    color: '#1a1a2e',
    marginBottom: '1rem',
  },
  productDescription: {
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '1rem',
    flex: 1,
  },
  productPrice: {
    fontSize: '1.75rem',
    color: '#16c79a',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  productActions: {
    marginTop: 'auto',
  },
  addButton: {
    width: '100%',
    backgroundColor: '#16c79a',
    color: '#fff',
    padding: '0.75rem',
    borderRadius: '5px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
  },
  quantityControl: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
  },
  quantityButton: {
    backgroundColor: '#1a1a2e',
    color: '#fff',
    width: '40px',
    height: '40px',
    borderRadius: '5px',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
  quantity: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    minWidth: '40px',
    textAlign: 'center',
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
    color: '#666',
    fontSize: '1.1rem',
  },
};

export default Products;
