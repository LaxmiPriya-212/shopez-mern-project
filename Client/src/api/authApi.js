import API from "./api";

export const loginUser = (userData) =>
  API.post("/auth/login", userData);

export const registerUser = (userData) =>
  API.post("/auth/register", userData);

export const getUserProfile = () =>
  API.get("/auth/profile");

export const updateUserProfile = (profileData) =>
  API.put("/auth/profile", profileData);

export const updateUserPassword = (passwordData) =>
  API.put("/auth/password", passwordData);

export const getWishlist = () =>
  API.get("/auth/wishlist");

export const toggleWishlist = (productId) =>
  API.post("/auth/wishlist", { productId });