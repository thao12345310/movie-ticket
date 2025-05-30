import axios from "axios";

// Kiểm tra xem người dùng đã đăng nhập chưa
export const isAuthenticated = () => {
  const user = localStorage.getItem("user");
  return !!user;
};

// Lấy thông tin người dùng từ localStorage
export const getUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Lỗi khi parse user data:", error);
    return null;
  }
};

// Lấy token JWT từ localStorage
export const getToken = () => {
  const user = getUser();
  return user?.token || "";
};

// Kiểm tra xem người dùng có quyền admin không
export const isAdmin = () => {
  const user = getUser();

  // Chỉ kiểm tra roles có chứa ROLE_ADMIN không
  return user?.roles?.includes("ROLE_ADMIN") || false;
};

// Thiết lập token cho axios
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

// Đăng nhập
export const login = async (username, password) => {
  try {
    const response = await axios.post("http://localhost:8080/api/auth/login", {
      username,
      password,
    });

    // Lưu thông tin người dùng và token vào localStorage
    localStorage.setItem("user", JSON.stringify(response.data));
    localStorage.setItem("token", response.data.token);

    // Thiết lập token cho axios
    setAuthToken(response.data.token);

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Đăng ký
export const signup = async (userData) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/auth/signup",
      userData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Đăng xuất
export const logout = (navigate) => {
  // Xóa thông tin người dùng và token từ localStorage
  localStorage.removeItem("user");
  localStorage.removeItem("token");

  // Xóa header Authorization
  setAuthToken(null);

  // Chuyển hướng về trang đăng nhập nếu có navigate
  if (navigate) {
    navigate("/login");
  }
};

// Thiết lập token ban đầu từ localStorage (có thể gọi khi ứng dụng khởi động)
export const setupAxiosInterceptors = () => {
  const token = getToken();
  setAuthToken(token);

  // Thiết lập interceptor để xử lý lỗi 401 (Unauthorized)
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Lấy đường dẫn hiện tại để kiểm tra xem có phải admin route không
        const currentPath = window.location.pathname;

        // Chỉ tự động đăng xuất nếu không phải trang admin
        // Nếu là trang admin, để component tự xử lý việc chuyển hướng
        if (!currentPath.startsWith("/admin/")) {
          // Đăng xuất nếu server trả về lỗi 401 trên các trang không phải admin
          logout();
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );
};
