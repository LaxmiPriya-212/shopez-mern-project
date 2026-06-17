import { useEffect, useState } from "react";
import { getProducts } from "../api/productApi";
import { getOrders } from "../api/orderApi";

function AdminStats() {
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const productRes = await getProducts();
      const orderRes = await getOrders();

      setProductCount(productRes.data.products.length);
      setOrderCount(orderRes.data.orders.length);

      const totalRevenue =
        orderRes.data.orders.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        );

      setRevenue(totalRevenue);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        📊 Dashboard Statistics
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        <div style={cardStyle}>
          <h2>📦 Products</h2>
          <h1>{productCount}</h1>
        </div>

        <div style={cardStyle}>
          <h2>🛒 Orders</h2>
          <h1>{orderCount}</h1>
        </div>

        <div style={cardStyle}>
          <h2>💰 Revenue</h2>
          <h1>₹{revenue}</h1>
        </div>

        <div style={cardStyle}>
          <h2>👥 Users</h2>
          <h1>1</h1>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "15px",
  textAlign: "center",
  boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
};

export default AdminStats;