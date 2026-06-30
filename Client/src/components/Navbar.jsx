import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { getProducts } from "../api/productApi";

function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const searchRef = useRef(null);
  const profileRef = useRef(null);

  // Debounced Search Suggestions
  useEffect(() => {
    if (keyword.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const { data } = await getProducts({ keyword, limit: 5 });
        if (data.success) {
          setSuggestions(data.products);
        }
      } catch (error) {
        console.error("Error fetching search suggestions", error);
      }
    }, 3000);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword]);

  // Click outside listener to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?search=${encodeURIComponent(keyword.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (productId) => {
    navigate(`/product/${productId}`);
    setKeyword("");
    setShowSuggestions(false);
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "rgba(15, 23, 42, 0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        color: "white",
        padding: "16px 24px",
        transition: "var(--transition)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          padding: 0,
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            fontSize: "1.75rem",
            fontWeight: "800",
            fontFamily: "'Outfit', sans-serif",
            background: "linear-gradient(135deg, #818cf8, #c084fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>🛒</span> ShopEZ
        </Link>

        {/* Search Bar with Suggestions */}
        <div
          ref={searchRef}
          style={{
            position: "relative",
            flexGrow: 1,
            maxWidth: "500px",
            display: "none", // hidden on small mobile, handled via media query
          }}
          className="nav-search-desktop"
        >
          <form onSubmit={handleSearchSubmit} style={{ display: "flex", width: "100%" }}>
            <input
              type="text"
              placeholder="Search premium products..."
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              style={{
                width: "100%",
                padding: "10px 16px",
                borderRadius: "var(--radius-full)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                background: "rgba(255, 255, 255, 0.1)",
                color: "white",
                fontSize: "0.9rem",
                outline: "none",
                transition: "var(--transition-fast)",
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") setShowSuggestions(false);
              }}
            />
            <button
              type="submit"
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.6)",
                cursor: "pointer",
                fontSize: "1.1rem",
              }}
            >
              🔍
            </button>
          </form>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "110%",
                left: 0,
                width: "100%",
                background: "#ffffff",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-lg)",
                overflow: "hidden",
                border: "1px solid var(--border-color)",
                zIndex: 1010,
              }}
            >
              {suggestions.map((p) => (
                <div
                  key={p._id}
                  onClick={() => handleSuggestionClick(p._id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    cursor: "pointer",
                    transition: "var(--transition-fast)",
                    borderBottom: "1px solid #f1f5f9",
                    color: "var(--text-dark)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <img
                    src={p.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80"}
                    alt={p.name}
                    style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
                  />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: "600", fontSize: "0.9rem" }}>{p.name}</span>
                    <span style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: "700" }}>₹{p.price}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Links & Action Buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
          }}
        >
          {/* Main Navigation (Desktop) */}
          <div
            style={{ display: "flex", gap: "20px", fontSize: "0.95rem", fontWeight: "500" }}
            className="nav-links-desktop"
          >
            <Link to="/" style={{ color: "rgba(255,255,255,0.8)" }} onMouseEnter={(e) => e.target.style.color = "white"} onMouseLeave={(e) => e.target.style.color = "rgba(255,255,255,0.8)"}>Home</Link>
            <Link to="/products" style={{ color: "rgba(255,255,255,0.8)" }} onMouseEnter={(e) => e.target.style.color = "white"} onMouseLeave={(e) => e.target.style.color = "rgba(255,255,255,0.8)"}>Shop</Link>
          </div>

          {/* Wishlist Icon */}
          <Link
            to="/wishlist"
            style={{
              position: "relative",
              fontSize: "1.3rem",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            ❤️
            {wishlist.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-10px",
                  background: "var(--danger)",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "0.7rem",
                  fontWeight: "700",
                }}
              >
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link
            to="/cart"
            style={{
              position: "relative",
              fontSize: "1.3rem",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            🛒
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-10px",
                  background: "var(--primary)",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "0.7rem",
                  fontWeight: "700",
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Account / Profile Menu */}
          <div ref={profileRef} style={{ position: "relative" }}>
            {user ? (
              <>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    padding: "8px 16px",
                    borderRadius: "var(--radius-full)",
                    color: "white",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  👤 {user.name.split(" ")[0]} ▾
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "125%",
                      right: 0,
                      width: "200px",
                      background: "#ffffff",
                      borderRadius: "var(--radius-md)",
                      boxShadow: "var(--shadow-lg)",
                      border: "1px solid var(--border-color)",
                      overflow: "hidden",
                      zIndex: 1010,
                      color: "var(--text-dark)",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
                      <span style={{ display: "block", fontWeight: "700", fontSize: "0.85rem" }}>{user.name}</span>
                      <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</span>
                    </div>
                    <Link to="/profile" onClick={() => setProfileDropdownOpen(false)} style={{ padding: "10px 16px", fontSize: "0.9rem" }} className="dropdown-item">My Profile</Link>
                    <Link to="/orders" onClick={() => setProfileDropdownOpen(false)} style={{ padding: "10px 16px", fontSize: "0.9rem" }} className="dropdown-item">My Orders</Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setProfileDropdownOpen(false)} style={{ padding: "10px 16px", fontSize: "0.9rem", fontWeight: "600", color: "var(--primary)", borderTop: "1px solid #f1f5f9" }} className="dropdown-item">Admin Dashboard</Link>
                    )}
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "10px 16px",
                        background: "none",
                        border: "none",
                        borderTop: "1px solid #f1f5f9",
                        color: "var(--danger)",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                        cursor: "pointer",
                      }}
                      className="dropdown-item"
                    >
                      Logout 🚪
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div style={{ display: "flex", gap: "12px" }}>
                <Link to="/login" className="btn btn-sm btn-secondary" style={{ color: "var(--text-dark)" }}>Login</Link>
                <Link to="/register" className="btn btn-sm btn-primary">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: "1.5rem",
              cursor: "pointer",
              display: "none", // hidden on desktop, shown via media query
            }}
            className="nav-mobile-toggle"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            display: "none", // shown via media query
            flexDirection: "column",
            gap: "16px",
            marginTop: "16px",
            padding: "16px 0",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
          className="nav-mobile-menu"
        >
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/products" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
        </div>
      )}

      {/* Add Responsive Styles for Navbar */}
      <style>{`
        @media (min-width: 769px) {
          .nav-search-desktop { display: block !important; }
        }
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .nav-mobile-toggle { display: block !important; }
          .nav-mobile-menu { display: flex !important; }
        }
        .dropdown-item {
          transition: var(--transition-fast);
        }
        .dropdown-item:hover {
          background-color: #f1f5f9;
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
