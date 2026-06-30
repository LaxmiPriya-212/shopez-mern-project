import API from "./api";

export const getProducts = (params = {}) =>
  API.get("/products", { params });

export const getProductById = (id) =>
  API.get(`/products/${id}`);

export const createProduct = (productData) =>
  API.post("/products", productData);

export const updateProduct = (id, productData) =>
  API.put(`/products/${id}`, productData);

export const deleteProduct = (id) =>
  API.delete(`/products/${id}`);

export const createProductReview = (id, reviewData) =>
  API.post(`/products/${id}/reviews`, reviewData);