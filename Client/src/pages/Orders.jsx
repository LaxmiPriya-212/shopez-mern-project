import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../api/orderApi";
import { useToast } from "../context/ToastContext";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await getMyOrders();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to fetch your orders", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "75vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="skeleton" style={{ width: "80px", height: "80px", borderRadius: "50%" }} />
      </div>
    );
  }

  return (
    <div className="section-padding anim-fade-in" style={{ minHeight: "85vh", textAlign: "left" }}>
      <div className="container" style={{ maxWidth: "850px" }}>
        <h1 style={{ marginBottom: "32px", fontSize: "2.25rem" }}>📦 My Orders</h1>

        {orders.length === 0 ? (
          <div
            className="glass-card"
            style={{
              padding: "60px 40px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <span style={{ fontSize: "4rem" }}>📦</span>
            <h2>No Orders Found</h2>
            <p style={{ color: "var(--text-muted)", maxWidth: "400px" }}>
              You haven't placed any orders yet. Explore our premium store collections and place your first order.
            </p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {orders.map((order) => {
              // Status Badge styling helper
              let statusBadge = "badge-warning";
              if (order.status === "Delivered") statusBadge = "badge-success";
              else if (order.status === "Shipped") statusBadge = "badge-primary";
              else if (order.status === "Cancelled") statusBadge = "badge-danger";

              const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              return (
                <div
                  key={order._id}
                  className="glass-card"
                  style={{
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {/* Order Top Panel */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "12px",
                      borderBottom: "1px solid var(--border-color)",
                      paddingBottom: "16px",
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Ordered on {orderDate}</span>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginTop: "4px" }}>
                        Order ID: <span style={{ color: "var(--primary)" }}>#{order._id}</span>
                      </h3>
                    </div>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span className={`badge ${statusBadge}`}>{order.status}</span>
                      <Link to={`/order/${order._id}`} className="btn btn-secondary btn-sm">
                        View Details
                      </Link>
                    </div>
                  </div>

                  {/* Order Products List */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {order.products.map((item) => (
                      <div
                        key={item._id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "0.95rem",
                        }}
                      >
                        <span style={{ fontWeight: "500" }}>
                          {item.product ? item.product.name : "Deleted Product"}{" "}
                          <strong style={{ color: "var(--text-muted)" }}>× {item.quantity}</strong>
                        </span>
                        <span style={{ fontWeight: "700" }}>
                          ₹{((item.product?.price || 0) * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>

                  <hr style={{ border: "none", borderTop: "1px solid var(--border-color)" }} />

                  {/* Order Total Panel */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex", gap: "16px", fontSize: "0.85rem" }}>
                      <span>
                        Payment:{" "}
                        <strong style={{ color: order.isPaid ? "var(--success)" : "var(--danger)" }}>
                          {order.isPaid ? "Paid" : "Unpaid"}
                        </strong>
                      </span>
                      <span>
                        Method: <strong>{order.paymentMethod}</strong>
                      </span>
                    </div>
                    
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--primary)" }}>
                      Total: ₹{order.totalAmount.toLocaleString("en-IN")}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;