import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById, updateOrderToPaid } from "../api/orderApi";
import { useToast } from "../context/ToastContext";
import Rating from "../components/Rating";

function OrderDetails() {
  const { id } = useParams();
  const { showToast } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getOrderById(id);
      if (data.success) {
        setOrder(data.order);
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to load order details", "error");
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handlePaymentSimulation = async () => {
    try {
      setPaying(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const paymentResult = {
        id: `pay_${Math.random().toString(36).substr(2, 9)}`,
        status: "COMPLETED",
        update_time: new Date().toISOString(),
        email_address: order.user?.email || "customer@example.com",
      };

      const { data } = await updateOrderToPaid(id, paymentResult);
      if (data.success) {
        showToast("Payment successful! 🎉💳", "success");
        setOrder(data.order);
      }
    } catch (error) {
      showToast("Payment simulation failed", "error");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "75vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="skeleton" style={{ width: "80px", height: "80px", borderRadius: "50%" }} />
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <h2>Order not found or unauthorized access.</h2>
      </div>
    );
  }

  // Tracking Timeline Helper
  const getStepActive = (stepName) => {
    const statuses = ["Pending", "Processing", "Shipped", "Delivered"];
    const currentIndex = statuses.indexOf(order.status);
    const stepIndex = statuses.indexOf(stepName);
    return stepIndex <= currentIndex;
  };

  return (
    <div className="section-padding anim-fade-in" style={{ minHeight: "85vh", textAlign: "left" }}>
      <div className="container" style={{ maxWidth: "1000px" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "16px", marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontSize: "2.25rem", margin: 0 }}>Order Details</h1>
            <span style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Order ID: <strong>{order._id}</strong></span>
          </div>
          <Link to="/orders" className="btn btn-secondary btn-sm">
            Back to Orders
          </Link>
        </div>

        {/* Tracking Timeline */}
        <div
          className="glass-card"
          style={{
            padding: "32px",
            marginBottom: "30px",
            background: "rgba(255, 255, 255, 0.95)",
          }}
        >
          <h3 style={{ fontSize: "1.2rem", marginBottom: "24px" }}>Order Status Timeline</h3>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }} className="timeline-wrapper">
            
            {["Pending", "Processing", "Shipped", "Delivered"].map((step, index) => {
              const active = getStepActive(step);
              return (
                <React.Fragment key={step}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2, flex: 1 }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: active ? "var(--success)" : "#cbd5e1",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        boxShadow: active ? "0 4px 10px rgba(16, 185, 129, 0.25)" : "none",
                        fontSize: "0.9rem",
                        transition: "var(--transition)",
                      }}
                    >
                      {active ? "✓" : index + 1}
                    </div>
                    <span style={{ fontSize: "0.85rem", fontWeight: "700", marginTop: "8px", color: active ? "var(--text-dark)" : "var(--text-muted)" }}>
                      {step}
                    </span>
                  </div>
                  {index < 3 && (
                    <div
                      style={{
                        height: "4px",
                        backgroundColor: getStepActive(["Pending", "Processing", "Shipped", "Delivered"][index + 1]) ? "var(--success)" : "#cbd5e1",
                        position: "absolute",
                        left: `${(index * 33) + 10}%`,
                        right: `${100 - ((index + 1) * 33) - 10}%`,
                        top: "16px",
                        zIndex: 1,
                        transition: "var(--transition)",
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Info Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "30px",
            marginBottom: "40px",
          }}
          className="order-info-grid"
        >
          {/* Left: Shipping & Payment Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            
            {/* Shipping Info */}
            <div className="glass-card" style={{ padding: "30px" }}>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "16px" }}>Shipping Address</h3>
              <p style={{ lineHeight: "1.6", color: "var(--text-main)", marginBottom: "16px" }}>
                <strong>{order.user?.name}</strong><br />
                {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}<br />
                Country: {order.shippingAddress?.country}
              </p>
              
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "var(--radius-sm)",
                  background: order.isDelivered ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                  color: order.isDelivered ? "var(--success)" : "var(--warning)",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                }}
              >
                {order.isDelivered ? `Delivered on ${new Date(order.deliveredAt).toLocaleString()}` : "Status: Out For Delivery / Pending"}
              </div>
            </div>

            {/* Payment Info */}
            <div className="glass-card" style={{ padding: "30px" }}>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "16px" }}>Payment Details</h3>
              <p style={{ marginBottom: "16px" }}>
                Method: <strong>{order.paymentMethod}</strong>
              </p>
              
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "var(--radius-sm)",
                  background: order.isPaid ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                  color: order.isPaid ? "var(--success)" : "var(--danger)",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                  marginBottom: "16px",
                }}
              >
                {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleString()}` : "Payment Status: Unpaid"}
              </div>

              {/* Pay Now Button (if online & unpaid) */}
              {!order.isPaid && order.paymentMethod === "Online Payment" && (
                <button
                  onClick={handlePaymentSimulation}
                  className="btn btn-success btn-block"
                  disabled={paying}
                  style={{ padding: "12px" }}
                >
                  {paying ? "Processing Payment..." : "Pay Now (Simulate Secure Payment) 💳"}
                </button>
              )}
            </div>

          </div>

          {/* Right: Order Items & Pricing Summary */}
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            
            {/* Items Summary */}
            <div className="glass-card" style={{ padding: "30px" }}>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "20px" }}>Ordered Items</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {order.products.map((item) => (
                  <div key={item._id} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <img
                      src={item.product?.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=60"}
                      alt={item.product?.name}
                      style={{ width: "55px", height: "55px", objectFit: "cover", borderRadius: "8px", backgroundColor: "#f1f5f9" }}
                    />
                    <div style={{ flexGrow: 1, textAlign: "left" }}>
                      <Link to={`/product/${item.product?._id}`} style={{ fontWeight: "600", fontSize: "0.9rem", color: "var(--text-dark)" }}>
                        {item.product?.name || "Deleted Product"}
                      </Link>
                      <span style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        ₹{item.product?.price} × {item.quantity}
                      </span>
                    </div>
                    <span style={{ fontWeight: "700", fontSize: "0.95rem" }}>
                      ₹{((item.product?.price || 0) * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="glass-card" style={{ padding: "30px", background: "#f8fafc" }}>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "16px" }}>Financial Summary</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.9rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Items Price</span>
                  <span>₹{order.itemsPrice?.toLocaleString("en-IN") || "0"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Tax Amount (GST 18%)</span>
                  <span>₹{order.taxPrice?.toLocaleString("en-IN") || "0"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Shipping Cost</span>
                  <span>{order.shippingPrice === 0 ? "FREE" : `₹${order.shippingPrice}`}</span>
                </div>
                <hr style={{ border: "none", borderTop: "1px solid var(--border-color)", margin: "8px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: "800", color: "var(--primary)" }}>
                  <span>Total Paid</span>
                  <span>₹{order.totalAmount?.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 992px) {
          .order-info-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 576px) {
          .timeline-wrapper {
            flex-direction: column !important;
            gap: 24px !important;
            align-items: flex-start !important;
          }
          .timeline-wrapper div {
            flex-direction: row !important;
            gap: 16px !important;
            align-items: center !important;
          }
          .timeline-wrapper div span {
            margin-top: 0 !important;
          }
          .timeline-wrapper div + div {
            display: none !important; /* Hide lines on mobile */
          }
        }
      `}</style>
    </div>
  );
}

export default OrderDetails;
