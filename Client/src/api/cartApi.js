import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/cart",
});

export const addToCart = (cartData) => API.post("/", cartData);

export const getCart = (userId) =>
  API.get(`/${userId}`);

export const removeCartItem = (cartId) =>
  API.delete(`/${cartId}`);