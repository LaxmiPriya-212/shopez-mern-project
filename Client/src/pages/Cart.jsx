import { useEffect, useState } from "react";
import { getCart, removeCartItem } from "../api/cartApi";
import { createOrder } from "../api/orderApi";

function Cart() {
  const [cart, setCart] = useState(null);

  const userId = "6a31732db963cb5a5a2e170f";

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const { data } = await getCart(userId);
      setCart(data.cart);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async (cartId) => {
    try {
      await removeCartItem(cartId);

      alert("Item Removed ❌");

      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  // Loading State
  if (!cart || !cart.items) {
    return (
      <div
        style={{
          minHeight: "85vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px",
        }}
      >
        🛒 Loading Cart...
      </div>
    );
  }

  // Calculate Total
  const totalAmount =
    cart.items.reduce(
      (total, item) =>
        total + item.product.price * item.quantity,
      0
    ) || 0;

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        user: cart.user._id,

        products: cart.items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),

        totalAmount,
      };

      await createOrder(orderData);

      alert("📦 Order Placed Successfully!");
    } catch (error) {
      console.log(error);
      alert("Order Failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "85vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg,#f8fafc,#e2e8f0)",
      }}
    >
      <div
        style={{
          width: "650px",
          background: "white",
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          🛒 My Cart
        </h1>

        {cart.items.length === 0 ? (
          <h2
            style={{
              textAlign: "center",
            }}
          >
            Cart is Empty 🛒
          </h2>
        ) : (
          <>
            {cart.items.map((item) => (
              <div
                key={item._id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  padding: "20px",
                  marginBottom: "15px",
                }}
              >
                <h2>{item.product.name}</h2>

                <p>
                  Quantity: {item.quantity}
                </p>

                <h3
                  style={{
                    color: "#2563eb",
                  }}
                >
                  ₹{item.product.price}
                </h3>

                <button
                  onClick={() => handleRemove(cart._id)}
                  style={{
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Remove ❌
                </button>
              </div>
            ))}

            <div
              style={{
                borderTop: "1px solid #ddd",
                paddingTop: "20px",
                marginTop: "20px",
              }}
            >
              <h2>Total: ₹{totalAmount}</h2>

              <button
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginBottom: "10px",
                }}
              >
                Proceed To Checkout 🚀
              </button>

              <button
                onClick={handlePlaceOrder}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "#16a34a",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                📦 Place Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;