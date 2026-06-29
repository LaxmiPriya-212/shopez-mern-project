import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Inline styling for the Toast Notification system
  const getToastColor = (type) => {
    switch (type) {
      case "success": return { bg: "#e6f4ea", text: "#137333", border: "#34a853" };
      case "error": return { bg: "#fce8e6", text: "#c5221f", border: "#ea4335" };
      case "warning": return { bg: "#fef7e0", text: "#b06000", border: "#fbbc05" };
      case "info":
      default: return { bg: "#e8f0fe", text: "#174ea6", border: "#1a73e8" };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div
        style={{
          position: "fixed",
          top: "24px",
          right: "24px",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          maxWidth: "400px",
          width: "calc(100% - 48px)",
        }}
      >
        {toasts.map((toast) => {
          const colors = getToastColor(toast.type);
          return (
            <div
              key={toast.id}
              onClick={() => removeToast(toast.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                borderRadius: "12px",
                background: colors.bg,
                color: colors.text,
                borderLeft: `5px solid ${colors.border}`,
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                cursor: "pointer",
                animation: "toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                fontSize: "0.95rem",
                fontWeight: "500",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span>
                  {toast.type === "success" && "✓"}
                  {toast.type === "error" && "✕"}
                  {toast.type === "warning" && "⚠"}
                  {toast.type === "info" && "ℹ"}
                </span>
                <span>{toast.message}</span>
              </div>
              <span style={{ fontSize: "12px", opacity: 0.6, marginLeft: "15px" }}>✕</span>
            </div>
          );
        })}
      </div>
      
      {/* Injecting CSS Keyframes dynamically */}
      <style>{`
        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateX(100px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};
