import axios from "axios";
import { getStoreSubdomain } from "../utils/storeUtils";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://backend-12-xsvw.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    const storeSubdomain = getStoreSubdomain();
    if (storeSubdomain) {
      config.headers["x-store-subdomain"] = storeSubdomain;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;