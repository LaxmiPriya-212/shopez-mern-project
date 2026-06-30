import React from "react";

export const ProductCardSkeleton = () => (
  <div
    className="glass-card"
    style={{
      padding: "16px",
      height: "400px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    }}
  >
    <div className="skeleton" style={{ height: "220px", width: "100%", borderRadius: "var(--radius-md)" }} />
    <div className="skeleton" style={{ height: "16px", width: "40%" }} />
    <div className="skeleton" style={{ height: "24px", width: "80%" }} />
    <div className="skeleton" style={{ height: "16px", width: "50%" }} />
    <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div className="skeleton" style={{ height: "28px", width: "60%" }} />
      <div className="skeleton" style={{ height: "42px", width: "100%" }} />
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 6 }) => (
  <div className="grid-4">
    {Array.from({ length: count }).map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "16px", background: "white", borderRadius: "var(--radius-md)" }}>
    <div style={{ display: "flex", gap: "16px" }}>
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: "24px", flex: 1 }} />
      ))}
    </div>
    <div style={{ height: "1px", backgroundColor: "var(--border-color)" }} />
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} style={{ display: "flex", gap: "16px" }}>
        {Array.from({ length: cols }).map((_, c) => (
          <div key={c} className="skeleton" style={{ height: "20px", flex: 1 }} />
        ))}
      </div>
    ))}
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="grid-2" style={{ marginTop: "40px" }}>
    <div className="skeleton" style={{ height: "480px", borderRadius: "var(--radius-lg)" }} />
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div className="skeleton" style={{ height: "20px", width: "30%" }} />
      <div className="skeleton" style={{ height: "48px", width: "90%" }} />
      <div className="skeleton" style={{ height: "24px", width: "40%" }} />
      <div className="skeleton" style={{ height: "36px", width: "50%" }} />
      <div style={{ height: "1px", backgroundColor: "var(--border-color)", margin: "10px 0" }} />
      <div className="skeleton" style={{ height: "80px", width: "100%" }} />
      <div className="skeleton" style={{ height: "48px", width: "60%" }} />
    </div>
  </div>
);
