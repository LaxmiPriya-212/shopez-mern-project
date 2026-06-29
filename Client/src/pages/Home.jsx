import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { getProducts } from "../api/productApi";
import ProductCarousel from "../components/ProductCarousel";
import ProductCard from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/LoadingSkeleton";

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [faqOpen, setFaqOpen] = useState({});

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        // Fetch products, limit to 4 for featured section
        const { data } = await getProducts({ limit: 4 });
        if (data.success) {
          setFeaturedProducts(data.products);
        }
      } catch (error) {
        console.error("Error fetching featured products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const toggleFaq = (index) => {
    setFaqOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const categories = [
    { name: "Mobiles", icon: "📱", count: "12 Products", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400" },
    { name: "Laptops", icon: "💻", count: "8 Products", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400" },
    { name: "Accessories", icon: "🎧", count: "25 Products", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" },
    { name: "Tablets", icon: "📟", count: "6 Products", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400" },
    { name: "Wearables", icon: "⌚", count: "15 Products", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" },
    { name: "TVs", icon: "📺", count: "5 Products", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400" },
  ];

  const testimonials = [
    { name: "Aarav Mehta", text: "Amazing shopping experience! The delivery was incredibly fast, and the smartwatch I ordered exceeded my expectations. 5 stars!", rating: 5, role: "Verified Purchaser" },
    { name: "Priya Sharma", text: "Customer service is top-notch. I had a small issue with my billing, and they resolved it in minutes. Highly recommend ShopEZ!", rating: 5, role: "Gold Member" },
    { name: "Rohan Das", text: "Premium products at very reasonable prices. The glassmorphic UI is super smooth and easy to navigate.", rating: 4, role: "Tech Enthusiast" },
  ];

  const faqs = [
    { q: "What is the delivery timeline?", a: "We ship within 24 hours of receiving your order. Standard shipping takes 3-5 business days depending on your location." },
    { q: "Do you offer cash on delivery (COD)?", a: "Yes, we offer Cash On Delivery for all orders across India, alongside secure online payment options." },
    { q: "What is your return policy?", a: "We offer a 10-day replacement or refund policy for all electronics and accessories if they arrive damaged or defective." },
  ];

  return (
    <div style={{ padding: "40px 0" }} className="anim-fade-in">
      <div className="container">
        {/* Hero Banner Slider */}
        <ProductCarousel />

        {/* Categories Section */}
        <section style={{ marginBottom: "80px" }}>
          <div className="section-header">
            <h2>Shop By Category</h2>
            <p>Explore our curated collections of premium electronics and accessories.</p>
          </div>

          <div className="grid-6" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px" }}>
            {categories.map((cat) => (
              <RouterLink
                key={cat.name}
                to={`/products?category=${cat.name}`}
                className="glass-card glass-card-hover"
                style={{
                  padding: "24px 16px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    background: "rgba(79, 70, 229, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2.2rem",
                  }}
                >
                  {cat.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "600" }}>{cat.name}</h3>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{cat.count}</span>
                </div>
              </RouterLink>
            ))}
          </div>
        </section>

        {/* Featured Products Section */}
        <section style={{ marginBottom: "80px" }}>
          <div className="section-header">
            <h2>Featured Products</h2>
            <p>Check out our hottest deals and newly launched tech gadgets.</p>
          </div>

          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <RouterLink to="/products" className="btn btn-secondary">
              View All Products ➜
            </RouterLink>
          </div>
        </section>

        {/* Promotion Banner */}
        <section
          className="glass-card"
          style={{
            background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)",
            color: "white",
            padding: "60px 80px",
            borderRadius: "var(--radius-lg)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "40px",
            marginBottom: "80px",
            position: "relative",
            overflow: "hidden",
          }}
          className="promo-banner"
        >
          <div style={{ position: "relative", zIndex: 2, maxWidth: "500px", textAlign: "left" }}>
            <span className="badge" style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white", marginBottom: "16px" }}>
              Limited Offer
            </span>
            <h2 style={{ color: "white", fontSize: "2.6rem", marginBottom: "16px" }}>
              Upgrade Your Setup
            </h2>
            <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.85)", marginBottom: "24px" }}>
              Get an extra 10% off on all laptop accessories this week. Use coupon code <strong style={{ color: "var(--accent)" }}>TECH10</strong> at checkout.
            </p>
            <RouterLink to="/products?category=Accessories" className="btn btn-secondary" style={{ color: "var(--primary)", fontWeight: "700" }}>
              Explore Accessories
            </RouterLink>
          </div>
          <div
            style={{
              position: "relative",
              zIndex: 2,
              fontSize: "10rem",
              opacity: 0.2,
              userSelect: "none",
            }}
            className="promo-icon"
          >
            🎧
          </div>
        </section>

        {/* Testimonials */}
        <section style={{ marginBottom: "80px" }}>
          <div className="section-header">
            <h2>What Our Customers Say</h2>
            <p>We pride ourselves on providing the best shopping experience possible.</p>
          </div>

          <div className="grid-3">
            {testimonials.map((t, index) => (
              <div
                key={index}
                className="glass-card"
                style={{
                  padding: "32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", gap: "2px", color: "var(--accent)", fontSize: "1.2rem" }}>
                  {"★".repeat(t.rating)}
                  {"☆".repeat(5 - t.rating)}
                </div>
                <p style={{ fontStyle: "italic", lineHeight: "1.7" }}>"{t.text}"</p>
                <div style={{ marginTop: "auto", display: "flex", flexDirection: "column" }}>
                  <strong style={{ color: "var(--text-dark)" }}>{t.name}</strong>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section style={{ marginBottom: "40px" }} id="faq">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Find answers to commonly asked questions about shipping, payments, and returns.</p>
          </div>

          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {faqs.map((faq, index) => {
              const isOpen = faqOpen[index];
              return (
                <div
                  key={index}
                  className="glass-card"
                  style={{
                    padding: "20px 28px",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleFaq(index)}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontWeight: "700",
                      fontSize: "1.1rem",
                      color: "var(--text-dark)",
                    }}
                  >
                    <span>{faq.q}</span>
                    <span>{isOpen ? "−" : "+"}</span>
                  </div>
                  {isOpen && (
                    <div
                      style={{
                        marginTop: "12px",
                        lineHeight: "1.6",
                        color: "var(--text-muted)",
                        borderTop: "1px solid var(--border-color)",
                        paddingTop: "12px",
                        animation: "fadeIn 0.3s ease",
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{
          position: "fixed",
          bottom: "32px",
          right: "32px",
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          backgroundColor: "var(--secondary)",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "1.2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "var(--shadow-lg)",
          zIndex: 99,
        }}
      >
        ▲
      </button>

      <style>{`
        @media (max-width: 768px) {
          .promo-banner {
            padding: 40px 32px !important;
            flex-direction: column !important;
          }
          .promo-icon {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;