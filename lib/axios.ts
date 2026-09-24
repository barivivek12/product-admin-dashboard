import axios from "axios";

const api = axios.create({
  baseURL: "https://dummyjson.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Centralized response error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Request cancellation is expected when
    // the user types a new search quickly.
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    console.error(
      "API Error:",
      error.response?.data || error.message
    );

    return Promise.reject(error);
  }
);

export default api;