import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getWishlist, toggleWishlist } from "../api/authApi";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const WishlistContext = createContext(null);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const { showToast } = useToast();

  const fetchUserWishlist = useCallback(async () => {
    if (!token) {
      setWishlist([]);
      return;
    }
    try {
      setLoading(true);
      const { data } = await getWishlist();
      if (data.success) {
        setWishlist(data.wishlist || []);
      }
    } catch (error) {
      console.error("Error fetching wishlist", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUserWishlist();
  }, [fetchUserWishlist]);

  const toggleItem = async (productId) => {
    if (!token) {
      showToast("Please log in to manage your wishlist ❤️", "warning");
      return false;
    }
    try {
      const { data } = await toggleWishlist(productId);
      if (data.success) {
        setWishlist(data.wishlist || []);
        showToast(data.message, "success");
        return true;
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to update wishlist", "error");
      return false;
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        toggleWishlist: toggleItem,
        isInWishlist,
        fetchUserWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
