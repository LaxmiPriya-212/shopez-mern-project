import API from "./api";

export const createOrder = (orderData) =>
  API.post("/orders", orderData);

export const getMyOrders = () =>
  API.get("/orders/myorders");

export const getOrderById = (id) =>
  API.get(`/orders/${id}`);

export const getOrders = () =>
  API.get("/orders");

export const updateOrderStatus = (id, statusData) =>
  API.put(`/orders/${id}/status`, statusData);

export const updateOrderToPaid = (id, paymentResult) =>
  API.put(`/orders/${id}/pay`, paymentResult);

export const getAdminStats = () =>
  API.get("/orders/stats");