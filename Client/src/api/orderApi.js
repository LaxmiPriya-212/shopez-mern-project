import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/orders",
});

export const getOrders = () =>
  API.get("/");

export const createOrder = (
  orderData
) => API.post("/", orderData);

export const updateOrderStatus = (
  id,
  statusData
) =>
  API.put(`/${id}`, statusData);