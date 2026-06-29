import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginUser, registerUser, getUserProfile, updateUserProfile, updateUserPassword } from "../api/authApi";
import { useToast } from "./ToastContext";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getUserProfile();
      if (data.success) {
        setUser(data.user);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Error loading user profile", error);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfile();
    } else {
      setLoading(false);
    }
  }, [token, loadUserProfile]);

  const login = async (email, password) => {
    try {
      const { data } = await loginUser({ email, password });
      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);
        showToast("Logged in successfully! 🚀", "success");
        return true;
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Login failed", "error");
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await registerUser({ name, email, password });
      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);
        showToast("Account created successfully! 🎉", "success");
        return true;
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Registration failed", "error");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    showToast("Logged out successfully 👋", "info");
  };

  const updateProfile = async (profileData) => {
    try {
      const { data } = await updateUserProfile(profileData);
      if (data.success) {
        setUser(data.user);
        showToast("Profile updated successfully! ✨", "success");
        return true;
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to update profile", "error");
      return false;
    }
  };

  const changePassword = async (passwordData) => {
    try {
      const { data } = await updateUserPassword(passwordData);
      if (data.success) {
        showToast("Password updated successfully! 🔑", "success");
        return true;
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to change password", "error");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        isAdmin: user && user.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
