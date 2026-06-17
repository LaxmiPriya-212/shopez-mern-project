import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/auth",
});

export const loginUser = (userData) =>
  API.post("/login", userData);

export const registerUser = (userData) =>
  API.post("/register", userData);