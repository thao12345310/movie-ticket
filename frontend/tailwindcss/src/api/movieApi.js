import axios from "axios";

const movieApi = axios.create({
  baseURL: "http://localhost:8080/api", // Đổi thành URL backend của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

export default movieApi;
