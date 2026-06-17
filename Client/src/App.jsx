import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";
import AdminProducts from "./pages/AdminProducts";
import AdminAddProduct from "./pages/AdminAddProduct";
import AdminOrders from "./pages/AdminOrders";
import AdminStats from "./pages/AdminStats";

function App() {
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logged Out Successfully 👋");

    window.location.reload();
  };

  return (
    <BrowserRouter>
      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          background: "linear-gradient(90deg,#0f172a,#1e293b)",
          color: "white",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "32px",
          }}
        >
          🛒 ShopEZ
        </h2>

        <div
          style={{
            display: "flex",
            gap: "25px",
            fontSize: "18px",
            alignItems: "center",
          }}
        >
          <Link
            to="/"
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            Home
          </Link>

          <Link
            to="/"
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            Products
          </Link>

          <Link
            to="/cart"
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            Cart
          </Link>

          <Link
            to="/orders"
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            Orders
          </Link>
                 <Link
  to="/admin"
  style={{
    color: "white",
    textDecoration: "none",
  }}
>
  Admin
</Link>
          {token ? (
            <button
              onClick={handleLogout}
              style={{
                background: "#ef4444",
                color: "white",
                border: "none",
                padding: "10px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Logout 🚪
            </button>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  color: "white",
                  textDecoration: "none",
                }}
              >
                Login
              </Link>

              <Link
                to="/register"
                style={{
                  color: "white",
                  textDecoration: "none",
                }}
              >
                Register
              </Link>
        
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin" element={<Admin />} />
        <Route
               path="/admin/products"
               element={<AdminProducts />}
/>
        <Route
               path="/admin/add-product"
               element={<AdminAddProduct />}
/>
        <Route
               path="/admin/orders"
               element={<AdminOrders />}
/>
        <Route
               path="/admin/stats"
               element={<AdminStats />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;