import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from "../api/cartApi";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const { showToast } = useToast();

  const fetchUserCart = useCallback(async () => {
    if (!token) {
      setCart(null);
      return;
    }
    try {
      setLoading(true);
      const { data } = await getCart();
      if (data.success) {
        setCart(data.cart);
      }
    } catch (error) {
      console.error("Error fetching cart", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUserCart();
  }, [fetchUserCart]);

  const addProductToCart = async (productId, quantity = 1) => {
    if (!token) {
      showToast("Please log in to add items to your cart 🛒", "warning");
      return false;
    }
    try {
      const { data } = await addToCart({ productId, quantity });
      if (data.success) {
        setCart(data.cart);
        showToast("Product added to cart! 🛒", "success");
        return true;
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to add product to cart", "error");
      return false;
    }
  };

  const updateProductQty = async (productId, quantity) => {
    try {
      const { data } = await updateCartItem({ productId, quantity });
      if (data.success) {
        setCart(data.cart);
        showToast("Cart updated", "success");
        return true;
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to update quantity", "error");
      return false;
    }
  };

  const removeProductFromCart = async (productId) => {
    try {
      const { data } = await removeCartItem(productId);
      if (data.success) {
        setCart(data.cart);
        showToast("Item removed from cart ❌", "success");
        return true;
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to remove item", "error");
      return false;
    }
  };

  const clearCartItems = async () => {
    try {
      const { data } = await clearCart();
      if (data.success) {
        setCart(data.cart);
        return true;
      }
    } catch (error) {
      console.error("Failed to clear cart", error);
      return false;
    }
  };

  // Calculations
  const cartCount = cart?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
  
  const cartTotal = cart?.items?.reduce(
    (sum, item) => sum + ((item.product?.price || 0) * (item.quantity || 0)),
    0
  ) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartCount,
        cartTotal,
        fetchUserCart,
        addProductToCart,
        updateProductQty,
        removeProductFromCart,
        clearCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
