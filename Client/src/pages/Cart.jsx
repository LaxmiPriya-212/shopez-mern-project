import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";

function Cart() {
  const { cart, loading, updateProductQty, removeProductFromCart, cartTotal } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0); // in percentage

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === "TECH10") {
      setDiscount(10);
      showToast("Coupon applied! 10% discount added. 🏷️", "success");
    } else {
      showToast("Invalid coupon code", "error");
      setDiscount(0);
    }
  };

  // Financial Breakdown
  const subtotal = cartTotal;
  const discountAmount = Math.round(subtotal * (discount / 100));
  const shippingCost = subtotal > 2000 || subtotal === 0 ? 0 : 99;
  const taxAmount = Math.round((subtotal - discountAmount) * 0.18); // 18% GST
  const finalTotal = subtotal - discountAmount + shippingCost;

  const handleCheckout = () => {
    // Save financial details in session storage for checkout page
    sessionStorage.setItem("checkout_financials", JSON.stringify({
      subtotal,
      discountAmount,
      shippingCost,
      taxAmount,
      finalTotal,
      discount,
    }));
    navigate("/checkout");
  };

  if (loading && !cart) {
    return (
      <div style={{ minHeight: "75vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="skeleton" style={{ width: "80px", height: "80px", borderRadius: "50%" }} />
      </div>
    );
  }

  const cartItems = cart?.items?.filter((item) => item.product) || [];

  return (
    <div className="section-padding anim-fade-in" style={{ minHeight: "85vh" }}>
      <div className="container">
        <h1 style={{ textAlign: "left", marginBottom: "32px", fontSize: "2.25rem" }}>Shopping Cart</h1>

        {cartItems.length === 0 ? (
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
            <span style={{ fontSize: "4rem" }}>🛒</span>
            <h2>Your Cart is Empty</h2>
            <p style={{ color: "var(--text-muted)", maxWidth: "400px" }}>
              Looks like you haven't added anything to your cart yet. Head back to the shop and explore our products.
            </p>
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.8fr 1fr",
              gap: "40px",
              alignItems: "start",
            }}
            className="cart-layout"
          >
            {/* Cart Items List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              
              {/* Free Shipping Progress Indicator */}
              <div
                className="glass-card"
                style={{
                  padding: "16px 24px",
                  textAlign: "left",
                  background: "rgba(255, 255, 255, 0.95)",
                }}
              >
                {subtotal >= 2000 ? (
                  <span style={{ fontWeight: "600", color: "var(--success)" }}>
                    🎉 You qualify for <strong>Free Shipping</strong>!
                  </span>
                ) : (
                  <div>
                    <p style={{ fontWeight: "500", fontSize: "0.95rem", marginBottom: "8px" }}>
                      Add <strong>₹{(2000 - subtotal).toLocaleString("en-IN")}</strong> more to get <strong>Free Shipping</strong>!
                    </p>
                    <div style={{ width: "100%", height: "6px", backgroundColor: "#e2e8f0", borderRadius: "3px", overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${Math.min((subtotal / 2000) * 100, 100)}%`,
                          height: "100%",
                          backgroundColor: "var(--primary)",
                          transition: "var(--transition)",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Items Card */}
              <div className="glass-card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                      borderBottom: "1px solid var(--border-color)",
                      paddingBottom: "24px",
                    }}
                    className="cart-item"
                  >
                    {/* Product Image */}
                    <img
                      src={item.product.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120"}
                      alt={item.product.name}
                      style={{
                        width: "90px",
                        height: "90px",
                        objectFit: "cover",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "#f1f5f9",
                      }}
                    />

                    {/* Product Details */}
                    <div style={{ flexGrow: 1, textAlign: "left" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>
                        {item.product.brand}
                      </span>
                      <Link to={`/product/${item.product._id}`} style={{ display: "block", margin: "2px 0 6px 0" }}>
                        <h3 style={{ fontSize: "1.05rem", fontWeight: "700" }}>{item.product.name}</h3>
                      </Link>
                      <span style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--primary)" }}>
                        ₹{item.product.price.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Quantity & Delete Controls */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "24px",
                      }}
                      className="cart-actions-wrapper"
                    >
                      {/* Quantity Selector */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid var(--border-color)",
                          borderRadius: "var(--radius-sm)",
                          background: "#f8fafc",
                          overflow: "hidden",
                        }}
                      >
                        <button
                          disabled={item.quantity <= 1}
                          onClick={() => updateProductQty(item.product._id, item.quantity - 1)}
                          style={qtyButtonStyle}
                        >
                          −
                        </button>
                        <span style={{ width: "32px", textAlign: "center", fontWeight: "600", fontSize: "0.9rem" }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateProductQty(item.product._id, item.quantity + 1)}
                          style={qtyButtonStyle}
                        >
                          +
                        </button>
                      </div>

                      {/* Delete / Move to Wishlist */}
                      <div style={{ display: "flex", gap: "12px" }}>
                        <button
                          onClick={() => {
                            toggleWishlist(item.product._id);
                            removeProductFromCart(item.product._id);
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "1.1rem",
                            color: "var(--text-muted)",
                          }}
                          title="Save for Later"
                        >
                          ❤️
                        </button>
                        <button
                          onClick={() => removeProductFromCart(item.product._id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "1.1rem",
                            color: "var(--danger)",
                          }}
                          title="Remove Item"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div
              className="glass-card"
              style={{
                padding: "30px",
                position: "sticky",
                top: "100px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                textAlign: "left",
              }}
            >
              <h3 style={{ fontSize: "1.35rem", marginBottom: "8px" }}>Order Summary</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.95rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                
                {discount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--success)", fontWeight: "600" }}>
                    <span>Discount ({discount}%)</span>
                    <span>- ₹{discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Shipping Cost</span>
                  <span>{shippingCost === 0 ? "FREE" : `₹${shippingCost}`}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                  <span>Estimated GST (18%)</span>
                  <span>Included</span>
                </div>

                <hr style={{ border: "none", borderTop: "1px solid var(--border-color)", margin: "8px 0" }} />

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.3rem", fontWeight: "800", color: "var(--text-dark)" }}>
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                <input
                  type="text"
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-color)",
                    fontSize: "0.85rem",
                    flexGrow: 1,
                    outline: "none",
                  }}
                />
                <button type="submit" className="btn btn-secondary btn-sm" style={{ padding: "10px 16px" }}>
                  Apply
                </button>
              </form>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Try coupon code: <strong>TECH10</strong></span>

              <button onClick={handleCheckout} className="btn btn-primary btn-block" style={{ marginTop: "12px", padding: "14px" }}>
                Proceed to Checkout 🚀
              </button>
            </div>
          </div>
        )}

        {/* Save for Later / Wishlist Section */}
        {wishlist.length > 0 && (
          <section style={{ marginTop: "80px", textAlign: "left" }}>
            <h2 style={{ marginBottom: "24px" }}>Saved For Later</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "24px",
              }}
            >
              {wishlist.map((item) => (
                <div
                  key={item._id}
                  className="glass-card"
                  style={{
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <img
                    src={item.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120"}
                    alt={item.name}
                    style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "var(--radius-md)" }}
                  />
                  <div>
                    <h4 style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</h4>
                    <span style={{ fontWeight: "700", color: "var(--primary)" }}>₹{item.price}</span>
                  </div>
                  <button
                    onClick={async () => {
                      // Move to Cart
                      const added = await updateProductQty(item._id, 1).catch(() => false);
                      if (!added) {
                        // If not in cart, add it
                        await removeProductFromCart(item._id).catch(() => {}); // clear any residue
                        await updateProductQty(item._id, 1);
                      }
                      toggleWishlist(item._id); // remove from wishlist
                    }}
                    className="btn btn-secondary btn-sm btn-block"
                  >
                    🛒 Move to Cart
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      <style>{`
        @media (max-width: 992px) {
          .cart-layout {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 576px) {
          .cart-item {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
          }
          .cart-actions-wrapper {
            width: 100% !important;
            justify-content: space-between !important;
          }
        }
      `}</style>
    </div>
  );
}

const qtyButtonStyle = {
  width: "32px",
  height: "32px",
  background: "none",
  border: "none",
  fontSize: "1.1rem",
  cursor: "pointer",
  transition: "var(--transition-fast)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default Cart;