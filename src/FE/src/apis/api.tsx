import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // Base URL of your backend API
  timeout: 5000, // Timeout for the request
});

export default api;
