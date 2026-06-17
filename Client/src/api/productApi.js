import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/products",
});

export const getProducts = () => API.get("/");

export const createProduct = (productData) =>
  API.post("/", productData);

export const deleteProduct = (id) =>
  API.delete(`/${id}`);