import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById, createProductReview } from "../api/productApi";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Rating from "../components/Rating";
import ProductCard from "../components/ProductCard";
import { ProductDetailSkeleton } from "../components/LoadingSkeleton";

function ProductDetails() {
  const { id } = useParams();
  const { addProductToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Image Zoom State
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [zoomed, setZoomed] = useState(false);

  const fetchProductDetails = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getProductById(id);
      if (data.success) {
        setProduct(data.product);
        setSimilarProducts(data.similarProducts || []);
        
        // Add to Recently Viewed in Session Storage
        updateRecentlyViewed(data.product);
      }
    } catch (error) {
      console.error("Error fetching product details", error);
      showToast("Product not found", "error");
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    fetchProductDetails();
    setQty(1); // reset qty on product change
  }, [fetchProductDetails]);

  // Load Recently Viewed on mount
  useEffect(() => {
    const list = JSON.parse(sessionStorage.getItem("recently_viewed") || "[]");
    // Filter out the current product
    setRecentlyViewed(list.filter((p) => p._id !== id).slice(0, 4));
  }, [id]);

  const updateRecentlyViewed = (currentProduct) => {
    let list = JSON.parse(sessionStorage.getItem("recently_viewed") || "[]");
    // Remove if already exists, then prepend
    list = list.filter((p) => p._id !== currentProduct._id);
    list.unshift({
      _id: currentProduct._id,
      name: currentProduct.name,
      price: currentProduct.price,
      image: currentProduct.image,
      category: currentProduct.category,
      brand: currentProduct.brand,
    });
    sessionStorage.setItem("recently_viewed", JSON.stringify(list.slice(0, 10)));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast("Please enter a comment", "warning");
      return;
    }

    try {
      setSubmittingReview(true);
      const { data } = await createProductReview(id, { rating, comment });
      if (data.success) {
        showToast("Review submitted successfully! 🎉", "success");
        setProduct(data.product);
        setComment("");
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to submit review", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Zoom Math
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y });
  };

  if (loading) {
    return (
      <div className="section-padding">
        <div className="container">
          <ProductDetailSkeleton />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <h2>Product not found.</h2>
      </div>
    );
  }

  const isFavorite = isInWishlist(product._id);
  const isOutOfStock = product.stock === 0;

  return (
    <div className="section-padding anim-fade-in" style={{ minHeight: "85vh", textAlign: "left" }}>
      <div className="container">
        
        {/* Breadcrumb */}
        <div style={{ marginBottom: "32px", fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: "500" }}>
          <Link to="/" style={{ color: "inherit" }}>Home</Link> /{" "}
          <Link to={`/products?category=${product.category}`} style={{ color: "inherit" }}>{product.category}</Link> /{" "}
          <span style={{ color: "var(--text-dark)", fontWeight: "600" }}>{product.name}</span>
        </div>

        {/* Product Details Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "50px",
            marginBottom: "80px",
            alignItems: "start",
          }}
          className="product-detail-layout"
        >
          {/* Left: Image Zoom Gallery */}
          <div
            className="glass-card"
            style={{
              padding: "20px",
              position: "relative",
              overflow: "hidden",
              cursor: "zoom-in",
              backgroundColor: "#ffffff",
            }}
            onMouseEnter={() => setZoomed(true)}
            onMouseLeave={() => setZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={product.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"}
              alt={product.name}
              style={{
                width: "100%",
                maxHeight: "500px",
                objectFit: "contain",
                borderRadius: "var(--radius-md)",
                display: zoomed ? "none" : "block",
              }}
            />
            {zoomed && (
              <div
                style={{
                  width: "100%",
                  height: "450px",
                  borderRadius: "var(--radius-md)",
                  backgroundImage: `url(${product.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000"})`,
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  backgroundSize: "200%",
                  backgroundRepeat: "no-repeat",
                }}
              />
            )}
          </div>

          {/* Right: Info Panels */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
                {product.brand}
              </span>
              <h1 style={{ fontSize: "2.5rem", margin: "8px 0 12px 0", color: "var(--text-dark)", lineHeight: "1.2" }}>
                {product.name}
              </h1>
              
              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                <Rating value={product.rating || 0} text={`${product.numReviews || 0} customer reviews`} />
                <span style={{ color: "var(--border-color)" }}>|</span>
                <span className={`badge ${isOutOfStock ? "badge-danger" : "badge-success"}`}>
                  {isOutOfStock ? "Out of Stock" : "In Stock"}
                </span>
              </div>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid var(--border-color)" }} />

            {/* Price Section */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontSize: "2rem", fontWeight: "800", color: "var(--primary)" }}>
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              <span style={{ fontSize: "1.2rem", color: "var(--text-muted)", textDecoration: "line-through" }}>
                ₹{Math.round(product.price * 1.25).toLocaleString("en-IN")}
              </span>
              <span className="badge badge-danger" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                20% OFF
              </span>
            </div>

            {/* Description */}
            <p style={{ color: "var(--text-main)", lineHeight: "1.7", fontSize: "1.05rem" }}>
              {product.description}
            </p>

            {/* Purchase Controls */}
            {!isOutOfStock && (
              <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap", marginTop: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                    background: "#f8fafc",
                    overflow: "hidden",
                    height: "48px",
                  }}
                >
                  <button
                    disabled={qty <= 1}
                    onClick={() => setQty(qty - 1)}
                    style={qtyBtnStyle}
                  >
                    −
                  </button>
                  <span style={{ width: "40px", textAlign: "center", fontWeight: "700" }}>{qty}</span>
                  <button
                    disabled={qty >= product.stock}
                    onClick={() => setQty(qty + 1)}
                    style={qtyBtnStyle}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => addProductToCart(product._id, qty)}
                  className="btn btn-primary"
                  style={{ height: "48px", padding: "0 32px", flexGrow: 1 }}
                >
                  🛒 Add to Cart
                </button>

                <button
                  onClick={() => toggleWishlist(product._id)}
                  className="btn btn-secondary"
                  style={{
                    height: "48px",
                    width: "48px",
                    padding: 0,
                    borderRadius: "var(--radius-md)",
                    fontSize: "1.3rem",
                  }}
                >
                  {isFavorite ? "❤️" : "🖤"}
                </button>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div style={{ marginTop: "24px" }}>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "16px" }}>Product Specifications</h3>
                <div className="custom-table-container">
                  <table className="custom-table">
                    <tbody>
                      {product.specifications.map((spec, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: "600", width: "40%", background: "#f8fafc" }}>{spec.name}</td>
                          <td>{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <section style={{ marginBottom: "80px" }}>
          <h2 style={{ marginBottom: "32px" }}>Reviews & Ratings</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.2fr",
              gap: "40px",
              alignItems: "start",
            }}
            className="reviews-layout"
          >
            {/* Left: Customer Reviews List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {product.reviews.length === 0 ? (
                <div className="glass-card" style={{ padding: "32px", textAlign: "center" }}>
                  <p style={{ color: "var(--text-muted)" }}>No reviews yet. Be the first to review this product!</p>
                </div>
              ) : (
                product.reviews.map((r) => (
                  <div
                    key={r._id}
                    className="glass-card"
                    style={{
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ color: "var(--text-dark)" }}>{r.name}</strong>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Rating value={r.rating} />
                    <p style={{ color: "var(--text-main)", fontSize: "0.95rem" }}>{r.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Right: Submit Review Form */}
            <div className="glass-card" style={{ padding: "32px" }}>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "20px" }}>Write a Customer Review</h3>
              
              {user ? (
                <form onSubmit={handleReviewSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="rating-select">Rating</label>
                    <select
                      id="rating-select"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="form-input form-select"
                      style={{ padding: "12px" }}
                    >
                      <option value={5}>5 - Excellent</option>
                      <option value={4}>4 - Very Good</option>
                      <option value={3}>3 - Good</option>
                      <option value={2}>2 - Fair</option>
                      <option value={1}>1 - Poor</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="comment-input">Comment</label>
                    <textarea
                      id="comment-input"
                      rows={4}
                      placeholder="Share your thoughts about this product..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="form-input"
                      style={{ resize: "none" }}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ alignSelf: "flex-start", padding: "12px 32px" }}
                    disabled={submittingReview}
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              ) : (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <p style={{ marginBottom: "16px", color: "var(--text-muted)" }}>
                    Please log in to write a review for this product.
                  </p>
                  <Link to={`/login?redirect=${encodeURIComponent(window.location.pathname)}`} className="btn btn-secondary btn-sm">
                    Log In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <section style={{ marginBottom: "80px" }}>
            <h2 style={{ marginBottom: "24px" }}>Similar Products</h2>
            <div className="grid-4">
              {similarProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Recently Viewed Section */}
        {recentlyViewed.length > 0 && (
          <section>
            <h2 style={{ marginBottom: "24px" }}>Recently Viewed</h2>
            <div className="grid-4">
              {recentlyViewed.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}

      </div>

      <style>{`
        @media (max-width: 992px) {
          .product-detail-layout {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
          .reviews-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

const qtyBtnStyle = {
  width: "40px",
  height: "100%",
  background: "none",
  border: "none",
  fontSize: "1.2rem",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default ProductDetails;
