import React from "react";

function Rating({ value, text, color = "#ffb300" }) {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (value >= i) {
      stars.push(<span key={i} style={{ color }}>★</span>);
    } else if (value >= i - 0.5) {
      stars.push(<span key={i} style={{ color, position: "relative", display: "inline-block" }}>
        <span style={{ color: "#e2e8f0" }}>★</span>
        <span style={{ color, position: "absolute", top: 0, left: 0, width: "50%", overflow: "hidden" }}>★</span>
      </span>);
    } else {
      stars.push(<span key={i} style={{ color: "#e2e8f0" }}>★</span>);
    }
  }

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "1.1rem" }}>
      <div style={{ display: "flex", gap: "2px" }}>{stars}</div>
      {text && <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "500" }}>{text}</span>}
    </div>
  );
}

export default Rating;
