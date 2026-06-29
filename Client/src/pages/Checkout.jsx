import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { createOrder } from "../api/orderApi";
import CheckoutSteps from "../components/CheckoutSteps";

function Checkout() {
  const { user } = useAuth();
  const { cart, clearCartItems } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Load financials from Cart page
  const financials = JSON.parse(sessionStorage.getItem("checkout_financials") || "null");

  // Step Management
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review

  // Shipping Form State
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });
  const [phone, setPhone] = useState("");

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");

  // Load user details on mount if available
  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      navigate("/cart");
      return;
    }
    if (user) {
      setPhone(user.phoneNumber || "");
      if (user.addresses && user.addresses.length > 0) {
        // Default to the first saved address
        const addr = user.addresses[0];
        setShippingAddress({
          street: addr.street || "",
          city: addr.city || "",
          state: addr.state || "",
          postalCode: addr.postalCode || "",
          country: addr.country || "India",
        });
      }
    }
  }, [user, cart, navigate]);

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode || !phone) {
      showToast("Please fill in all shipping details", "warning");
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    try {
      const orderProducts = cart.items
        .filter((item) => item.product)
        .map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        }));

      const orderData = {
        products: orderProducts,
        shippingAddress,
        paymentMethod,
        itemsPrice: financials?.subtotal || cart.total,
        taxPrice: financials?.taxAmount || 0,
        shippingPrice: financials?.shippingCost || 0,
        totalAmount: financials?.finalTotal || cart.total,
      };

      const { data } = await createOrder(orderData);
      if (data.success) {
        // Clear cart in MERN state & DB
        await clearCartItems();
        
        // Show Success Toast
        showToast("Order placed successfully! 📦", "success");
        
        // Redirect to Order Details page
        navigate(`/order/${data.order._id}`);
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to place order", "error");
    }
  };

  return (
    <div className="section-padding anim-fade-in" style={{ minHeight: "85vh", textAlign: "left" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        
        {/* Checkout Stepper */}
        <CheckoutSteps step1={true} step2={step >= 2} step3={step >= 3} />

        <div className="glass-card" style={{ padding: "40px" }}>
          
          {/* STEP 1: SHIPPING ADDRESS */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: "1.5rem", marginBottom: "24px" }}>Shipping Details</h2>
              
              {/* Saved Addresses Quick Select */}
              {user?.addresses && user.addresses.length > 0 && (
                <div style={{ marginBottom: "24px" }}>
                  <label className="form-label">Select Saved Address</label>
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    {user.addresses.map((addr, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setShippingAddress({
                          street: addr.street,
                          city: addr.city,
                          state: addr.state,
                          postalCode: addr.postalCode,
                          country: addr.country,
                        })}
                        style={{
                          padding: "10px 16px",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--border-color)",
                          background: "#f8fafc",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        📍 Address {i + 1} ({addr.city})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleShippingSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="street">Street Address</label>
                  <input
                    id="street"
                    type="text"
                    placeholder="Flat No, Building Name, Street"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="city">City</label>
                    <input
                      id="city"
                      type="text"
                      placeholder="Mumbai"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="state">State</label>
                    <input
                      id="state"
                      type="text"
                      placeholder="Maharashtra"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="postal-code">Postal Code (PIN)</label>
                    <input
                      id="postal-code"
                      type="text"
                      placeholder="400001"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="phone-input">Phone Number</label>
                    <input
                      id="phone-input"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-end", padding: "12px 32px" }}>
                  Continue to Payment ➜
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: "1.5rem", marginBottom: "24px" }}>Select Payment Method</h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "20px",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                    background: paymentMethod === "Cash On Delivery" ? "rgba(79, 70, 229, 0.05)" : "none",
                    borderColor: paymentMethod === "Cash On Delivery" ? "var(--primary)" : "var(--border-color)",
                    cursor: "pointer",
                    transition: "var(--transition-fast)",
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash On Delivery"
                    checked={paymentMethod === "Cash On Delivery"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ width: "20px", height: "20px", accentColor: "var(--primary)" }}
                  />
                  <div>
                    <strong style={{ display: "block", fontSize: "1.05rem" }}>Cash On Delivery (COD)</strong>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Pay with cash upon delivery. Additional ₹50 COD fee waived.</span>
                  </div>
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "20px",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                    background: paymentMethod === "Online Payment" ? "rgba(79, 70, 229, 0.05)" : "none",
                    borderColor: paymentMethod === "Online Payment" ? "var(--primary)" : "var(--border-color)",
                    cursor: "pointer",
                    transition: "var(--transition-fast)",
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Online Payment"
                    checked={paymentMethod === "Online Payment"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ width: "20px", height: "20px", accentColor: "var(--primary)" }}
                  />
                  <div>
                    <strong style={{ display: "block", fontSize: "1.05rem" }}>Credit/Debit Card, UPI, Netbanking</strong>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Pay securely using our online payment gateway. Simulated transaction.</span>
                  </div>
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button onClick={() => setStep(1)} className="btn btn-secondary">
                  ⬅ Back
                </button>
                <button onClick={() => setStep(3)} className="btn btn-primary" style={{ padding: "12px 32px" }}>
                  Review Order ➜
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ORDER REVIEW */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: "1.5rem", marginBottom: "24px" }}>Review Your Order</h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "32px" }}>
                {/* Shipping Review */}
                <div>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "8px", color: "var(--text-dark)" }}>Shipping Address</h3>
                  <p style={{ color: "var(--text-main)" }}>
                    {user?.name}<br />
                    {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}<br />
                    Phone: {phone}
                  </p>
                </div>

                <hr style={{ border: "none", borderTop: "1px solid var(--border-color)" }} />

                {/* Payment Review */}
                <div>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "8px", color: "var(--text-dark)" }}>Payment Method</h3>
                  <p style={{ color: "var(--text-main)", fontWeight: "600" }}>{paymentMethod}</p>
                </div>

                <hr style={{ border: "none", borderTop: "1px solid var(--border-color)" }} />

                {/* Items Review */}
                <div>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "12px", color: "var(--text-dark)" }}>Items in Order</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {cart.items.map((item) => (
                      <div key={item._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.95rem" }}>
                          {item.product?.name} <strong style={{ color: "var(--text-muted)" }}>× {item.quantity}</strong>
                        </span>
                        <span style={{ fontWeight: "700" }}>
                          ₹{((item.product?.price || 0) * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <hr style={{ border: "none", borderTop: "1px solid var(--border-color)" }} />

                {/* Price Breakdown */}
                <div>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "12px", color: "var(--text-dark)" }}>Total Calculations</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.95rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Subtotal</span>
                      <span>₹{financials?.subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    {financials?.discountAmount > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", color: "var(--success)", fontWeight: "600" }}>
                        <span>Discount ({financials.discount}%)</span>
                        <span>- ₹{financials.discountAmount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Shipping</span>
                      <span>{financials?.shippingCost === 0 ? "FREE" : `₹${financials.shippingCost}`}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.25rem", fontWeight: "800", color: "var(--primary)", borderTop: "1px solid var(--border-color)", paddingTop: "10px", marginTop: "5px" }}>
                      <span>Total Amount</span>
                      <span>₹{financials?.finalTotal.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button onClick={() => setStep(2)} className="btn btn-secondary">
                  ⬅ Back
                </button>
                <button onClick={handlePlaceOrder} className="btn btn-success" style={{ padding: "12px 36px" }}>
                  Confirm & Place Order 📦
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Checkout;
