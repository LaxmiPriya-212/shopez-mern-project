import { useEffect, useState } from "react";
import { getOrders } from "../api/orderApi";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await getOrders();
      setOrders(data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        minHeight: "85vh",
        padding: "40px",
        background:
          "linear-gradient(135deg,#f8fafc,#e2e8f0)",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        📦 My Orders
      </h1>

      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "15px",
            marginBottom: "20px",
            boxShadow:
              "0 10px 25px rgba(0,0,0,0.08)",
          }}
        >
          <h3>
            Order ID: {order._id}
          </h3>

          <p>
            Customer: {order.user.name}
          </p>

          <p>
            Status: {order.status}
          </p>

          <h3>
            Total: ₹{order.totalAmount}
          </h3>
        </div>
      ))}
    </div>
  );
}

export default Orders;