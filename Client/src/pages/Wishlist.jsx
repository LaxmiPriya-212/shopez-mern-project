import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import Rating from "../components/Rating";

function Wishlist() {
  const { wishlist, toggleWishlist, loading } = useWishlist();
  const { addProductToCart } = useCart();

  if (loading && wishlist.length === 0) {
    return (
      <div style={{ minHeight: "75vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="skeleton" style={{ width: "80px", height: "80px", borderRadius: "50%" }} />
      </div>
    );
  }

  return (
    <div className="section-padding anim-fade-in" style={{ minHeight: "85vh", textAlign: "left" }}>
      <div className="container">
        <h1 style={{ marginBottom: "32px", fontSize: "2.25rem" }}>My Wishlist ❤️</h1>

        {wishlist.length === 0 ? (
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
            <span style={{ fontSize: "4rem" }}>❤️</span>
            <h2>Your Wishlist is Empty</h2>
            <p style={{ color: "var(--text-muted)", maxWidth: "400px" }}>
              Explore our products and tap the heart icon on items you love to save them here.
            </p>
            <Link to="/products" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "30px",
            }}
          >
            {wishlist.map((product) => (
              <div
                key={product._id}
                className="glass-card glass-card-hover"
                style={{
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  height: "100%",
                }}
              >
                {/* Remove Button */}
                <button
                  onClick={() => toggleWishlist(product._id)}
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    background: "rgba(255, 255, 255, 0.9)",
                    border: "none",
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "var(--shadow-sm)",
                    color: "var(--danger)",
                    fontSize: "1.1rem",
                    zIndex: 2,
                  }}
                >
                  ✕
                </button>

                {/* Product Image */}
                <Link
                  to={`/product/${product._id}`}
                  style={{
                    height: "200px",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    marginBottom: "16px",
                    backgroundColor: "#f1f5f9",
                  }}
                >
                  <img
                    src={product.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"}
                    alt={product.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Link>

                {/* Product Details */}
                <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>
                    {product.brand}
                  </span>
                  <Link to={`/product/${product._id}`} style={{ margin: "4px 0 8px 0" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: "700", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {product.name}
                    </h3>
                  </Link>

                  <div style={{ marginBottom: "12px" }}>
                    <Rating value={product.rating || 0} text={`(${product.numReviews || 0})`} />
                  </div>

                  <div
                    style={{
                      marginTop: "auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <span style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--primary)" }}>
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>

                    <button
                      onClick={async () => {
                        const added = await addProductToCart(product._id, 1);
                        if (added) {
                          toggleWishlist(product._id); // remove from wishlist after adding to cart
                        }
                      }}
                      className="btn btn-primary btn-block"
                    >
                      🛒 Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
