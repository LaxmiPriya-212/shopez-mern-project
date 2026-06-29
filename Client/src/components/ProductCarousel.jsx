import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const slides = [
  {
    id: 1,
    title: "Next-Gen Smartwatches",
    subtitle: "Track your fitness, notifications, and style. Up to 7 days battery life.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&auto=format&fit=crop&q=80",
    link: "/products?category=Wearables",
    badge: "New Arrival",
    bg: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
  },
  {
    id: 2,
    title: "Revolutionary Audio Experience",
    subtitle: "Active Noise Cancelling, ultra-clear vocals, and deep bass. Experience sound like never before.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&auto=format&fit=crop&q=80",
    link: "/products?category=Accessories",
    badge: "Trending Now",
    bg: "linear-gradient(135deg, #1e1b4b 0%, #311042 100%)",
  },
  {
    id: 3,
    title: "Ultimate Ultrabooks",
    subtitle: "Intel Core i7, 16GB RAM, 1TB SSD. Engineered for extreme productivity and creators.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1600&auto=format&fit=crop&q=80",
    link: "/products?category=Laptops",
    badge: "Flash Deal",
    bg: "linear-gradient(135deg, #0f172a 0%, #032e3a 100%)",
  },
];

function ProductCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div
      style={{
        position: "relative",
        height: "480px",
        width: "100%",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        boxShadow: "var(--shadow-xl)",
        marginBottom: "40px",
      }}
      className="hero-carousel"
    >
      {/* Slides */}
      {slides.map((slide, index) => {
        const isActive = index === current;
        return (
          <div
            key={slide.id}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: isActive ? 1 : 0,
              visibility: isActive ? "visible" : "hidden",
              transition: "opacity 0.8s ease, visibility 0.8s ease",
              background: slide.bg,
              display: "flex",
              alignItems: "center",
              padding: "0 80px",
            }}
            className="carousel-slide"
          >
            {/* Background Image Overlay */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "50%",
                height: "100%",
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
                WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
                opacity: 0.85,
              }}
              className="carousel-image-panel"
            />

            {/* Slide Text Content */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                maxWidth: "550px",
                textAlign: "left",
                color: "white",
                transform: isActive ? "translateY(0)" : "translateY(20px)",
                opacity: isActive ? 1 : 0,
                transition: "transform 0.8s ease, opacity 0.8s ease",
              }}
            >
              <span
                className="badge badge-primary"
                style={{
                  background: "rgba(129, 140, 248, 0.25)",
                  color: "#a5b4fc",
                  border: "1px solid rgba(129, 140, 248, 0.4)",
                  marginBottom: "16px",
                  fontSize: "0.8rem",
                }}
              >
                {slide.badge}
              </span>
              <h1
                style={{
                  fontSize: "3.2rem",
                  fontWeight: "800",
                  lineHeight: "1.15",
                  marginBottom: "16px",
                  color: "white",
                  letterSpacing: "-1px",
                }}
                className="carousel-title"
              >
                {slide.title}
              </h1>
              <p
                style={{
                  fontSize: "1.15rem",
                  color: "rgba(255,255,255,0.75)",
                  marginBottom: "28px",
                  lineHeight: "1.5",
                }}
              >
                {slide.subtitle}
              </p>
              <Link to={slide.link} className="btn btn-primary" style={{ padding: "14px 32px" }}>
                Shop Now ➜
              </Link>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        style={arrowButtonStyle}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        style={{ ...arrowButtonStyle, right: "24px", left: "auto" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
      >
        ›
      </button>

      {/* Dots Indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "24px",
          left: "80px",
          display: "flex",
          gap: "8px",
          zIndex: 3,
        }}
        className="carousel-dots"
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              border: "none",
              background: index === current ? "white" : "rgba(255,255,255,0.4)",
              cursor: "pointer",
              transition: "var(--transition-fast)",
            }}
          />
        ))}
      </div>

      {/* Responsive adjustments */}
      <style>{`
        @media (max-width: 768px) {
          .hero-carousel { height: 380px !important; }
          .carousel-slide { padding: 0 32px !important; }
          .carousel-image-panel { width: 100% !important; opacity: 0.3 !important; }
          .carousel-title { font-size: 2.2rem !important; }
          .carousel-dots { left: 32px !important; }
        }
      `}</style>
    </div>
  );
}

const arrowButtonStyle = {
  position: "absolute",
  top: "50%",
  left: "24px",
  transform: "translateY(-50%)",
  zIndex: 3,
  width: "44px",
  height: "44px",
  borderRadius: "50%",
  border: "none",
  background: "rgba(255, 255, 255, 0.15)",
  backdropFilter: "blur(4px)",
  color: "white",
  fontSize: "1.75rem",
  fontWeight: "300",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "var(--transition-fast)",
};

export default ProductCarousel;
