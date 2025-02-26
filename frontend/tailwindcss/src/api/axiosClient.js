import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080", // Thay bằng API của backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để xử lý lỗi hoặc token
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default axiosClient;
