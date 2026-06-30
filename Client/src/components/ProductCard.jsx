import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import Rating from "./Rating";

function ProductCard({ product }) {
  const { addProductToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isFavorite = isInWishlist(product._id);

  // Fallback Unsplash Images based on category if product.image is broken or placeholder
  const getProductImage = () => {
    if (product.image && !product.image.includes("placeholder")) {
      return product.image;
    }
    switch (product.category) {
      case "Mobiles":
        return "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800";
      case "Laptops":
        return "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800";
      case "Accessories":
        return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800";
      case "Tablets":
        return "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800";
      case "Wearables":
        return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800";
      case "TVs":
        return "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800";
      default:
        return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800";
    }
  };

  const mockOriginalPrice = Math.round(product.price * 1.25);

  return (
    <div
      className="glass-card glass-card-hover"
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "16px",
        overflow: "hidden",
      }}
    >
      {/* Category & Discount Badges */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        <span className="badge badge-primary">{product.category}</span>
        <span className="badge badge-danger">20% OFF</span>
      </div>

      {/* Wishlist Toggle Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product._id);
        }}
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          zIndex: 2,
          background: "rgba(255, 255, 255, 0.85)",
          border: "none",
          width: "38px",
          height: "38px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "var(--shadow-sm)",
          transition: "var(--transition-fast)",
          fontSize: "1.2rem",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <span style={{ color: isFavorite ? "var(--danger)" : "var(--text-muted)" }}>
          {isFavorite ? "♥" : "♡"}
        </span>
      </button>

      {/* Image Section */}
      <Link
        to={`/product/${product._id}`}
        style={{
          display: "block",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          height: "220px",
          marginBottom: "16px",
          backgroundColor: "#f1f5f9",
        }}
      >
        <img
          src={getProductImage()}
          alt={product.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
      </Link>

      {/* Content Section */}
      <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {product.brand}
        </span>
        
        <Link to={`/product/${product._id}`} style={{ margin: "4px 0 8px 0" }}>
          <h3
            style={{
              fontSize: "1.15rem",
              fontWeight: "600",
              color: "var(--text-dark)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              lineHeight: "1.3",
            }}
          >
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div style={{ marginBottom: "12px" }}>
          <Rating value={product.rating || 0} text={`(${product.numReviews || 0})`} />
        </div>

        {/* Price & Cart */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <span style={{ fontSize: "1.4rem", fontWeight: "800", color: "var(--primary)" }}>
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            <span style={{ fontSize: "0.95rem", color: "var(--text-muted)", textDecoration: "line-through" }}>
              ₹{mockOriginalPrice.toLocaleString("en-IN")}
            </span>
          </div>

          <button
            onClick={() => addProductToCart(product._id, 1)}
            className="btn btn-primary btn-block"
            style={{ padding: "10px 16px", fontSize: "0.9rem" }}
          >
            🛒 Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
