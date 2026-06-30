import API from "./api";

export const getCart = () =>
  API.get("/cart");

export const addToCart = (cartItem) =>
  API.post("/cart", cartItem);

export const updateCartItem = (cartItem) =>
  API.put("/cart", cartItem);

export const removeCartItem = (productId) =>
  API.delete(`/cart/${productId}`);

export const clearCart = () =>
  API.delete("/cart");