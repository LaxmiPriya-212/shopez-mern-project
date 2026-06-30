import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Redirect parameter (e.g. if redirected from cart, go back to checkout)
  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please fill in all fields", "warning");
      return;
    }

    try {
      setLoading(true);
      const success = await login(email, password);
      if (success) {
        navigate(redirect);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="section-padding anim-fade-in"
      style={{
        minHeight: "85vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.05) 0%, transparent 40%)",
      }}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "440px",
          padding: "40px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "8px", color: "var(--text-dark)" }}>Welcome Back</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "32px" }}>Sign in to continue shopping on ShopEZ</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label className="form-label" htmlFor="password" style={{ margin: 0 }}>Password</label>
              <span style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: "600", cursor: "pointer" }}>
                Forgot Password?
              </span>
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            style={{ padding: "14px", marginTop: "10px" }}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In 🚀"}
          </button>
        </form>

        <p style={{ marginTop: "24px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
          New to ShopEZ?{" "}
          <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} style={{ color: "var(--primary)", fontWeight: "700" }}>
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;