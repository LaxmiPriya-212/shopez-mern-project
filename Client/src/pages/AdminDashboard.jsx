import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { getProducts, deleteProduct, createProduct, updateProduct } from "../api/productApi";
import { getOrders, updateOrderStatus, getAdminStats } from "../api/orderApi";
import { useToast } from "../context/ToastContext";
import { TableSkeleton } from "../components/LoadingSkeleton";

function AdminDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();

  // Navigation Tab State: 'analytics', 'products', 'add-product', 'orders'
  const [activeTab, setActiveTab] = useState("analytics");

  // Core Data State
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms & Modal State
  const [editingProduct, setEditingProduct] = useState(null); // holds product object if editing
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    image: "",
    stock: "",
    isFeatured: false,
    specifications: [{ name: "", value: "" }],
  });

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch stats
      const statsRes = await getAdminStats();
      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }

      // Fetch products
      const productsRes = await getProducts({ limit: 100 }); // fetch up to 100 for admin
      if (productsRes.data.success) {
        setProducts(productsRes.data.products);
      }

      // Fetch orders
      const ordersRes = await getOrders();
      if (ordersRes.data.success) {
        setOrders(ordersRes.data.orders);
      }
    } catch (error) {
      console.error("Error loading admin dashboard data", error);
      showToast("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const { data } = await deleteProduct(id);
        if (data.success) {
          showToast("Product deleted successfully", "success");
          loadDashboardData();
        }
      } catch (error) {
        showToast("Failed to delete product", "error");
      }
    }
  };

  // Add/Edit Product Submission
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      // Filter out empty specifications
      const specs = productForm.specifications.filter((s) => s.name.trim() && s.value.trim());
      const submissionData = { ...productForm, specifications: specs };

      if (editingProduct) {
        // Update Product
        const { data } = await updateProduct(editingProduct._id, submissionData);
        if (data.success) {
          showToast("Product updated successfully! ✨", "success");
          setEditingProduct(null);
          loadDashboardData();
          setActiveTab("products");
        }
      } else {
        // Create Product
        const { data } = await createProduct(submissionData);
        if (data.success) {
          showToast("Product added successfully! 📦", "success");
          resetProductForm();
          loadDashboardData();
          setActiveTab("products");
        }
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Operation failed", "error");
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      category: "",
      brand: "",
      image: "",
      stock: "",
      isFeatured: false,
      specifications: [{ name: "", value: "" }],
    });
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "",
      brand: product.brand || "",
      image: product.image || "",
      stock: product.stock || "",
      isFeatured: product.isFeatured || false,
      specifications: product.specifications?.length > 0
        ? product.specifications.map((s) => ({ name: s.name, value: s.value }))
        : [{ name: "", value: "" }],
    });
    setActiveTab("add-product"); // redirect to form tab
  };

  // Update Order Status
  const handleOrderStatusChange = async (orderId, status) => {
    try {
      const { data } = await updateOrderStatus(orderId, { status });
      if (data.success) {
        showToast(`Order status updated to ${status} 🚚`, "success");
        loadDashboardData();
      }
    } catch (error) {
      showToast("Failed to update status", "error");
    }
  };

  // Specs Form Helpers
  const addSpecField = () => {
    setProductForm({
      ...productForm,
      specifications: [...productForm.specifications, { name: "", value: "" }],
    });
  };

  const handleSpecChange = (index, field, value) => {
    const updatedSpecs = [...productForm.specifications];
    updatedSpecs[index][field] = value;
    setProductForm({ ...productForm, specifications: updatedSpecs });
  };

  const removeSpecField = (index) => {
    const updatedSpecs = productForm.specifications.filter((_, i) => i !== index);
    setProductForm({ ...productForm, specifications: updatedSpecs });
  };

  return (
    <div className="anim-fade-in" style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", textAlign: "left" }}>
      
      {/* Sidebar Navigation */}
      <aside
        style={{
          width: "260px",
          background: "var(--secondary)",
          color: "white",
          padding: "32px 0",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          position: "sticky",
          top: 0,
          height: "100vh",
          zIndex: 10,
        }}
      >
        <div style={{ padding: "0 24px 24px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: "16px" }}>
          <h2 style={{ color: "white", fontSize: "1.4rem", fontFamily: "'Outfit', sans-serif" }}>ShopEZ Admin</h2>
          <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>Logged in as: {user?.name.split(" ")[0]}</span>
        </div>

        <button onClick={() => { setActiveTab("analytics"); setEditingProduct(null); }} style={getSidebarTabStyle(activeTab === "analytics")}>📊 Analytics</button>
        <button onClick={() => { setActiveTab("products"); setEditingProduct(null); }} style={getSidebarTabStyle(activeTab === "products")}>📦 Products Manager</button>
        <button onClick={() => { setActiveTab("add-product"); }} style={getSidebarTabStyle(activeTab === "add-product")}>
          {editingProduct ? "✏️ Edit Product" : "➕ Add Product"}
        </button>
        <button onClick={() => { setActiveTab("orders"); setEditingProduct(null); }} style={getSidebarTabStyle(activeTab === "orders")}>🚚 Orders Manager</button>
      </aside>

      {/* Main Panel Content */}
      <main style={{ flexGrow: 1, padding: "40px", overflowY: "auto" }}>
        
        {loading && !stats ? (
          <TableSkeleton rows={6} cols={5} />
        ) : (
          <>
            {/* ANALYTICS TAB */}
            {activeTab === "analytics" && stats && (
              <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
                <h1 style={{ fontSize: "2rem", margin: 0 }}>Analytics Dashboard</h1>
                
                {/* Stats Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }} className="grid-4">
                  <div className="glass-card" style={statCardStyle}>
                    <span style={{ fontSize: "2rem" }}>💰</span>
                    <div>
                      <span style={{ display: "block", color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: "600" }}>TOTAL REVENUE</span>
                      <strong style={{ fontSize: "1.6rem", color: "var(--text-dark)" }}>₹{stats.revenue?.toLocaleString("en-IN")}</strong>
                    </div>
                  </div>
                  <div className="glass-card" style={statCardStyle}>
                    <span style={{ fontSize: "2rem" }}>🛒</span>
                    <div>
                      <span style={{ display: "block", color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: "600" }}>TOTAL ORDERS</span>
                      <strong style={{ fontSize: "1.6rem", color: "var(--text-dark)" }}>{stats.orderCount}</strong>
                    </div>
                  </div>
                  <div className="glass-card" style={statCardStyle}>
                    <span style={{ fontSize: "2rem" }}>📦</span>
                    <div>
                      <span style={{ display: "block", color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: "600" }}>PRODUCTS</span>
                      <strong style={{ fontSize: "1.6rem", color: "var(--text-dark)" }}>{stats.productCount}</strong>
                    </div>
                  </div>
                  <div className="glass-card" style={statCardStyle}>
                    <span style={{ fontSize: "2rem" }}>👥</span>
                    <div>
                      <span style={{ display: "block", color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: "600" }}>USERS</span>
                      <strong style={{ fontSize: "1.6rem", color: "var(--text-dark)" }}>{stats.userCount}</strong>
                    </div>
                  </div>
                </div>

                {/* Category Inventory Breakdown */}
                <div className="glass-card" style={{ padding: "30px", background: "white" }}>
                  <h3 style={{ fontSize: "1.25rem", marginBottom: "24px" }}>Product Categories Distribution</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {stats.categoryData?.map((cat) => {
                      const percentage = Math.round((cat.count / stats.productCount) * 100);
                      return (
                        <div key={cat._id} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem", fontWeight: "600" }}>
                            <span>{cat._id || "Uncategorized"}</span>
                            <span>{cat.count} products ({percentage}%)</span>
                          </div>
                          <div style={{ width: "100%", height: "8px", backgroundColor: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
                            <div style={{ width: `${percentage}%`, height: "100%", backgroundColor: "var(--primary)", borderRadius: "4px" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* PRODUCTS TAB */}
            {activeTab === "products" && (
              <div>
                <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>Manage Products</h1>
                <div className="custom-table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Brand</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p._id}>
                          <td>
                            <img src={p.image} alt={p.name} style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "4px" }} />
                          </td>
                          <td style={{ fontWeight: "600", maxWidth: "240px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</td>
                          <td>{p.brand}</td>
                          <td>{p.category}</td>
                          <td style={{ fontWeight: "700" }}>₹{p.price}</td>
                          <td>
                            <span className={`badge ${p.stock === 0 ? "badge-danger" : "badge-success"}`}>
                              {p.stock} pcs
                            </span>
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: "12px" }}>
                              <button onClick={() => handleEditClick(p)} style={actionBtnStyle} title="Edit">✏️</button>
                              <button onClick={() => handleDeleteProduct(p._id)} style={{ ...actionBtnStyle, color: "var(--danger)" }} title="Delete">🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ADD/EDIT PRODUCT TAB */}
            {activeTab === "add-product" && (
              <div className="glass-card" style={{ padding: "40px", background: "white", maxWidth: "800px" }}>
                <h1 style={{ fontSize: "1.75rem", marginBottom: "24px" }}>
                  {editingProduct ? `Edit Product: ${editingProduct.name}` : "Create New Product"}
                </h1>
                
                <form onSubmit={handleProductSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "20px" }} className="grid-2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="p-name">Product Name</label>
                      <input
                        id="p-name"
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="p-brand">Brand</label>
                      <input
                        id="p-brand"
                        type="text"
                        value={productForm.brand}
                        onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="p-desc">Description</label>
                    <textarea
                      id="p-desc"
                      rows={4}
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="form-input"
                      style={{ resize: "none" }}
                      required
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="p-price">Price (INR)</label>
                      <input
                        id="p-price"
                        type="number"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="p-category">Category</label>
                      <select
                        id="p-category"
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="form-input form-select"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Mobiles">Mobiles</option>
                        <option value="Laptops">Laptops</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Tablets">Tablets</option>
                        <option value="Wearables">Wearables</option>
                        <option value="TVs">TVs</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="p-stock">Stock Quantity</label>
                      <input
                        id="p-stock"
                        type="number"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="p-image">Image URL</label>
                    <input
                      id="p-image"
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>

                  {/* Specifications fields */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h4 style={{ fontSize: "1rem" }}>Technical Specifications</h4>
                      <button type="button" onClick={addSpecField} className="btn btn-secondary btn-sm">
                        ＋ Add Field
                      </button>
                    </div>
                    {productForm.specifications.map((spec, i) => (
                      <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <input
                          type="text"
                          placeholder="Spec Name (e.g. RAM)"
                          value={spec.name}
                          onChange={(e) => handleSpecChange(i, "name", e.target.value)}
                          className="form-input"
                          style={{ padding: "10px" }}
                        />
                        <input
                          type="text"
                          placeholder="Value (e.g. 16 GB)"
                          value={spec.value}
                          onChange={(e) => handleSpecChange(i, "value", e.target.value)}
                          className="form-input"
                          style={{ padding: "10px" }}
                        />
                        <button
                          type="button"
                          onClick={() => removeSpecField(i)}
                          style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", fontSize: "1.1rem" }}
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
                    <button type="submit" className="btn btn-primary" style={{ padding: "12px 36px" }}>
                      {editingProduct ? "Save Changes" : "➕ Create Product"}
                    </button>
                    {editingProduct && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct(null);
                          resetProductForm();
                          setActiveTab("products");
                        }}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <div>
                <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>Manage Orders</h1>
                <div className="custom-table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Delivery Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o._id}>
                          <td style={{ fontWeight: "700" }}>#{o._id.substr(-6)}</td>
                          <td>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                              <strong>{o.user?.name || "Deleted User"}</strong>
                              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{o.user?.email}</span>
                            </div>
                          </td>
                          <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                          <td style={{ fontWeight: "700" }}>₹{o.totalAmount.toLocaleString("en-IN")}</td>
                          <td>
                            <span className={`badge ${o.isPaid ? "badge-success" : "badge-danger"}`}>
                              {o.isPaid ? "Paid" : "Unpaid"}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${o.status === "Delivered" ? "badge-success" : o.status === "Shipped" ? "badge-primary" : "badge-warning"}`}>
                              {o.status}
                            </span>
                          </td>
                          <td>
                            <select
                              value={o.status}
                              onChange={(e) => handleOrderStatusChange(o._id, e.target.value)}
                              className="form-input"
                              style={{ padding: "6px 10px", fontSize: "0.85rem", width: "130px" }}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

const getSidebarTabStyle = (isActive) => ({
  width: "100%",
  textAlign: "left",
  padding: "14px 24px",
  background: isActive ? "rgba(255, 255, 255, 0.08)" : "none",
  border: "none",
  borderLeft: isActive ? "4px solid var(--primary-light)" : "4px solid transparent",
  color: isActive ? "white" : "rgba(255,255,255,0.7)",
  fontWeight: isActive ? "700" : "500",
  fontSize: "0.95rem",
  cursor: "pointer",
  transition: "var(--transition-fast)",
});

const statCardStyle = {
  padding: "24px",
  display: "flex",
  alignItems: "center",
  gap: "16px",
  background: "white",
  boxShadow: "var(--shadow-md)",
};

const actionBtnStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "1rem",
  transition: "var(--transition-fast)",
};

export default AdminDashboard;
