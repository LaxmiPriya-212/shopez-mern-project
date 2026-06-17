import { useEffect, useState } from "react";
import {
  getOrders,
  updateOrderStatus,
} from "../api/orderApi";

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

      alert("✅ Order Status Updated");

      fetchOrders();
    } catch (error) {
      console.log(error);
      alert("❌ Failed To Update Status");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
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
        🚚 Manage Orders
      </h1>

      {orders.length === 0 ? (
        <h2 style={{ textAlign: "center" }}>
          No Orders Found 📭
        </h2>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "15px",
              marginBottom: "20px",
              boxShadow:
                "0 10px 25px rgba(0,0,0,0.08)",
            }}
          >
            <h3>
              👤 Customer: {order.user?.name}
            </h3>

            <p>
              📧 Email: {order.user?.email}
            </p>

            <p>
              💳 Payment Method:{" "}
              {order.paymentMethod}
            </p>

            <p>
              💰 Total Amount: ₹
              {order.totalAmount}
            </p>

            <p>
              📅 Ordered On:{" "}
              {new Date(
                order.createdAt
              ).toLocaleDateString()}
            </p>

            <h4>🛍 Products</h4>

            {order.products.map((item) => (
              <div
                key={item._id}
                style={{
                  paddingLeft: "15px",
                  marginBottom: "8px",
                }}
              >
                <p>
                  {item.product
                    ? item.product.name
                    : "Deleted Product"}
                </p>

                <p>
                  Quantity: {item.quantity}
                </p>
              </div>
            ))}

            <hr />

            <h3>
              🚚 Status: {order.status}
            </h3>

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
                border: "1px solid #ddd",
                marginTop: "10px",
              }}
            >
              <option value="Pending">
                Pending
              </option>

              <option value="Processing">
                Processing
              </option>

              <option value="Shipped">
                Shipped
              </option>

              <option value="Delivered">
                Delivered
              </option>
            </select>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminOrders;