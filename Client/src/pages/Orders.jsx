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
              🆔 Order ID: {order._id}
            </h3>

            <p>
              👤 Customer: {order.user?.name}
            </p>

            <p>
              💳 Payment Method:{" "}
              {order.paymentMethod ||
                "Cash On Delivery"}
            </p>

            <p>
              🚚 Status: {order.status}
            </p>

            <p>
              📅 Ordered On:{" "}
              {new Date(
                order.createdAt
              ).toLocaleDateString()}
            </p>

            <hr />

            <h3>🛍 Products</h3>

            {order.products.map((item) => (
              <div
                key={item._id}
                style={{
                  padding: "10px 0",
                }}
              >
                <p>
                  Product:{" "}
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

            <h2
              style={{
                color: "#2563eb",
              }}
            >
              💰 Total Amount: ₹
              {order.totalAmount}
            </h2>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;