import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/",
  timeout: 5000, // Timeout for the request
});

// Request Interceptor: Attach JWT Access Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 and Refresh Token
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401, not already retried, and is not the refresh token endpoint itself
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "token/refresh/"
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }
        
        // Make the refresh request using standard axios to avoid interceptor loops
        const res = await axios.post(
          `${api.defaults.baseURL}token/refresh/`, 
          { refresh: refreshToken }
        );
        
        if (res.status === 200) {
          // Update tokens
          localStorage.setItem("accessToken", res.data.access);
          if (res.data.refresh) {
             localStorage.setItem("refreshToken", res.data.refresh);
          }
          
          // Update the failed request with the new token
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
          
          // Retry the request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed or expired
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        
        // Redirect to login page
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
