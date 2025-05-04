// redux/axiosInstance.js
import axios from "axios";
import store from "./store"; // Import the Redux store instance (adjust path if needed)

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "/api", // Fallback or default base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Adds the token to every outgoing request
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage (or Redux state) dynamically
    // Using localStorage is simpler here if authSaga updates it reliably.
    // If token is managed purely in Redux state: const token = store.getState().auth.token;
    const token = localStorage.getItem("token");

    if (token) {
      // If a token exists, add the Authorization header
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      console.log("Interceptor: No token found.");
    }
    return config; // Return the modified config
  },
  (error) => {
    // Handle request error
    console.error("Axios request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Optional: Response Interceptor (Example: for handling 401 Unauthorized globally)
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    const originalRequest = error.config;

    // Example: Handle expired token / 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.warn("Axios response interceptor: Received 401 Unauthorized.");
      originalRequest._retry = true; // Mark request to prevent infinite loops

      // Perform actions needed for unauthorized access:
      // 1. Clear local storage/state
      localStorage.removeItem("token");
      // Dispatch logout action using the imported store
      // Ensure you have access to the store instance here
      // store.dispatch(logout()); // Dispatch the logout action from authSlice

      // 2. Redirect to login page
      // Use window.location or integrate with your router history outside React components
      // window.location.href = '/login';

      // Optionally try to refresh token here if you have that mechanism

      // Reject the promise to prevent the original caller from receiving the error
      // if you are handling the redirect globally. Or return the error if
      // components need to react to the 401 specifically.
      return Promise.reject(error.response?.data || error.message);
    }

    // Handle other errors
    console.error(
      "Axios response interceptor error:",
      error.response?.data || error.message
    );
    return Promise.reject(error.response?.data || error.message); // Return structured error
  }
);

export default axiosInstance;
