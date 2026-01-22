// src/utils/axiosInstance.js
import axios from "axios";

// Detect environment variable based on build tool
const API_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // set true only if using cookies
});

// === REQUEST INTERCEPTOR ===
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // Only set JSON header when not sending FormData
    if (!(config.data instanceof FormData) && !config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// === RESPONSE INTERCEPTOR ===
let isRefreshing = false;
let failedQueue:any = [];

const processQueue = (error:any, token = null) => {
  failedQueue.forEach((prom:any) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) return Promise.reject(error);
    if (error.response.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/auth/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          `${API_BASE_URL}/auth/refresh?refreshToken=${refreshToken}`
        );

        if (res.data?.success && res.data?.data) {
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            res.data.data;

          localStorage.setItem("accessToken", newAccessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return axiosInstance(originalRequest);
        } else {
          throw new Error("Invalid refresh response");
        }
      } catch (err) {
        console.error("Token refresh failed:", err);
        processQueue(err, null);
        localStorage.clear();
        window.location.href = "/auth/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      "An unexpected error occurred";

    console.error("API Error:", message);
    return Promise.reject({ ...error, message });
  }
);

export default axiosInstance;
