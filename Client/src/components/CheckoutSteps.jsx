import React from "react";
import { Link } from "react-router-dom";

function CheckoutSteps({ step1, step2, step3 }) {
  const steps = [
    { name: "Sign In", active: step1, link: "/login" },
    { name: "Shipping Address", active: step2, link: "/checkout?step=shipping" },
    { name: "Payment Method", active: step3, link: "/checkout?step=payment" },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "16px",
        margin: "0 auto 40px auto",
        maxWidth: "650px",
        padding: "0 16px",
      }}
    >
      {steps.map((step, index) => (
        <React.Fragment key={step.name}>
          {/* Step Indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: step.active ? "var(--primary)" : "#cbd5e1",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
                fontSize: "0.9rem",
                boxShadow: step.active ? "0 4px 10px rgba(79, 70, 229, 0.25)" : "none",
                transition: "var(--transition)",
              }}
            >
              {index + 1}
            </div>
            
            <span
              style={{
                fontSize: "0.9rem",
                fontWeight: step.active ? "700" : "500",
                color: step.active ? "var(--text-dark)" : "var(--text-muted)",
                transition: "var(--transition)",
                whiteSpace: "nowrap",
              }}
            >
              {step.name}
            </span>
          </div>

          {/* Connection Line */}
          {index < steps.length - 1 && (
            <div
              style={{
                flexGrow: 1,
                height: "2px",
                backgroundColor: steps[index + 1].active ? "var(--primary)" : "#cbd5e1",
                minWidth: "30px",
                transition: "var(--transition)",
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default CheckoutSteps;
