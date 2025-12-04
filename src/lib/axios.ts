// lib/axios.ts
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true, // send refresh token cookie automatically
});

// --- Request Interceptor: attach access token ---
api.interceptors.request.use((config) => {
  const atk = getCookie("atk");
  if (atk && config.headers) {
    config.headers.Authorization = `Bearer ${atk}`;
  }
  return config;
});

// --- Response Interceptor: handle expired token ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // if access token expired (401) and not retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh token endpoint
        const refreshRes = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh_token`,
          {},
          { withCredentials: true }
        );
        if (!refreshRes.data.success) {
          window.location.href = "/signin";
        }
        
        const newAccessToken = refreshRes.data.accessToken;
        if (newAccessToken) {
          // Save new token to cookies
          setCookie("atk", newAccessToken, { maxAge: 60 * 60 * 24 }); // 1 day


          // Update header and retry original request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshErr) {
        console.error("Refresh token failed:", refreshErr);
        // optionally redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/signin";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
