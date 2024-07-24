import axios from "axios";

const baseURL='http://127.0.0.1:8000/'
const api = axios.create({
    baseURL: baseURL,
})

// Request interceptor to add the token to the headers
api.interceptors.request.use(
    (config) => {
      const token = JSON.parse(localStorage.getItem("ACCESS_TOKEN"));
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // Response interceptor to handle token expiration and refresh
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const refreshToken = JSON.parse(localStorage.getItem("REFRESH_TOKEN"))
            const response = await axios.post(`${baseURL}/token/refresh/`, { refresh: refreshToken });
            localStorage.setItem("REFRESH_TOKEN", JSON.stringify(response.data));
            originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
            return api(originalRequest);
        } catch (err) {
            localStorage.removeItem("REFRESH_TOKEN");
            window.location.href = "/login"; // Redirect to login page if refresh token fails
        }
      }
      return Promise.reject(error);
    }
  );
  
  export default api;