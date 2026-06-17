import { Link } from "react-router-dom";

function Admin() {
  return (
    <div
      style={{
        padding: "40px",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "40px",
          color: "#1e293b",
        }}
      >
        👨‍💼 Admin Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {/* Products Card */}
        <Link
          to="/admin/products"
          style={{
            textDecoration: "none",
            color: "black",
          }}
        >
          <div
            style={cardStyle}
          >
            <h2>📦 Products</h2>
            <p>Manage Products</p>
          </div>
        </Link>

        {/* Add Product Card */}
        <Link
          to="/admin/add-product"
          style={{
            textDecoration: "none",
            color: "black",
          }}
        >
          <div
            style={cardStyle}
          >
            <h2>➕ Add Product</h2>
            <p>Create New Product</p>
          </div>
        </Link>

        {/* Orders Card */}
        <Link
          to="/admin/orders"
          style={{
            textDecoration: "none",
            color: "black",
          }}
        >
          <div
            style={cardStyle}
          >
            <h2>🛒 Orders</h2>
            <p>Manage Orders</p>
          </div>
        </Link>

        {/* Statistics Card */}
        <Link
          to="/admin/stats"
          style={{
            textDecoration: "none",
            color: "black",
          }}
        >
          <div
            style={cardStyle}
          >
            <h2>📊 Statistics</h2>
            <p>View Dashboard Stats</p>
          </div>
        </Link>

        {/* Users Card */}
        <div
          style={cardStyle}
        >
          <h2>👥 Users</h2>
          <p>View Users</p>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "15px",
  boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
  cursor: "pointer",
  transition: "0.3s",
};

export default Admin;