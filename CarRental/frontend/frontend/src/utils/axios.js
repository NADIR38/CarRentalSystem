import axios from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "../Auth/tokenStore";

// Use environment variable for API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:7051/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

// Attach access token
api.interceptors.request.use(config => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto refresh on 401
api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401) {
      try {
        const res = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        setAccessToken(res.data.accessToken);
        err.config.headers.Authorization =
          `Bearer ${res.data.accessToken}`;

        return api(err.config);
      } catch {
        clearAccessToken();
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;