import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";

function Footer() {
  const [email, setEmail] = useState("");
  const { showToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      showToast("Thank you for subscribing to our newsletter! ✉️", "success");
      setEmail("");
    }
  };

  return (
    <footer
      style={{
        backgroundColor: "var(--secondary)",
        color: "rgba(255, 255, 255, 0.7)",
        paddingTop: "64px",
        paddingBottom: "32px",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        marginTop: "auto",
        fontSize: "0.95rem",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr 2fr",
            gap: "40px",
            marginBottom: "48px",
          }}
          className="footer-grid"
        >
          {/* Brand Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h2 style={{ color: "white", fontSize: "1.6rem", fontFamily: "'Outfit', sans-serif" }}>
              🛒 ShopEZ
            </h2>
            <p style={{ lineHeight: "1.6", maxWidth: "260px" }}>
              Your ultimate destination for premium tech, wearables, laptops, and accessories. Elevate your lifestyle.
            </p>
            <div style={{ display: "flex", gap: "12px", fontSize: "1.2rem", marginTop: "8px" }}>
              <span style={{ cursor: "pointer", color: "white" }}>🌐</span>
              <span style={{ cursor: "pointer", color: "white" }}>📘</span>
              <span style={{ cursor: "pointer", color: "white" }}>📸</span>
              <span style={{ cursor: "pointer", color: "white" }}>🐦</span>
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ color: "white", fontSize: "1.1rem" }}>Shop</h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
              <li><Link to="/products?category=Mobiles" style={{ color: "inherit" }} onMouseEnter={(e) => e.target.style.color="white"} onMouseLeave={(e) => e.target.style.color="inherit"}>Mobiles</Link></li>
              <li><Link to="/products?category=Laptops" style={{ color: "inherit" }} onMouseEnter={(e) => e.target.style.color="white"} onMouseLeave={(e) => e.target.style.color="inherit"}>Laptops</Link></li>
              <li><Link to="/products?category=Wearables" style={{ color: "inherit" }} onMouseEnter={(e) => e.target.style.color="white"} onMouseLeave={(e) => e.target.style.color="inherit"}>Wearables</Link></li>
              <li><Link to="/products?category=Accessories" style={{ color: "inherit" }} onMouseEnter={(e) => e.target.style.color="white"} onMouseLeave={(e) => e.target.style.color="inherit"}>Accessories</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ color: "white", fontSize: "1.1rem" }}>Support</h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
              <li><Link to="/profile" style={{ color: "inherit" }} onMouseEnter={(e) => e.target.style.color="white"} onMouseLeave={(e) => e.target.style.color="inherit"}>My Account</Link></li>
              <li><Link to="/orders" style={{ color: "inherit" }} onMouseEnter={(e) => e.target.style.color="white"} onMouseLeave={(e) => e.target.style.color="inherit"}>Track Orders</Link></li>
              <li><a href="#faq" style={{ color: "inherit" }} onMouseEnter={(e) => e.target.style.color="white"} onMouseLeave={(e) => e.target.style.color="inherit"}>FAQs</a></li>
              <li><a href="#contact" style={{ color: "inherit" }} onMouseEnter={(e) => e.target.style.color="white"} onMouseLeave={(e) => e.target.style.color="inherit"}>Contact Us</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ color: "white", fontSize: "1.1rem" }}>Stay Connected</h3>
            <p>Subscribe to our newsletter to receive updates on new arrivals, exclusive offers, and flash sales.</p>
            <form onSubmit={handleSubscribe} style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  padding: "12px 16px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.05)",
                  color: "white",
                  fontSize: "0.9rem",
                  flexGrow: 1,
                  outline: "none",
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: "12px 20px" }}>
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Divider & Bottom Info */}
        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            paddingTop: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            fontSize: "0.85rem",
          }}
        >
          <span>© {new Date().getFullYear()} ShopEZ. All rights reserved.</span>
          <div style={{ display: "flex", gap: "24px" }}>
            <span style={{ cursor: "pointer" }}>Privacy Policy</span>
            <span style={{ cursor: "pointer" }}>Terms of Service</span>
          </div>
        </div>
      </div>

      {/* Responsive Styles for Footer */}
      <style>{`
        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 576px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer;
