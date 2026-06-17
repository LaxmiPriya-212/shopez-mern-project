import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "../api/orderApi";

function AdminOrders() {
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

  const handleStatusChange = async (
    orderId,
    status
  ) => {
    try {
      await updateOrderStatus(orderId, {
        status,
      });

      alert("✅ Status Updated");

      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        🛒 Manage Orders
      </h1>

      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            background: "white",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "15px",
            boxShadow:
              "0 10px 20px rgba(0,0,0,0.08)",
          }}
        >
          <h3>
            Customer: {order.user.name}
          </h3>

          <p>
            Total: ₹{order.totalAmount}
          </p>

          <p>
            Status: {order.status}
          </p>

          <select
            value={order.status}
            onChange={(e) =>
              handleStatusChange(
                order._id,
                e.target.value
              )
            }
            style={{
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
          </select>
        </div>
      ))}
    </div>
  );
}

export default AdminOrders;