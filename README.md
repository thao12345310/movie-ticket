# Hệ Thống Đặt Vé Xem Phim

Đây là một ứng dụng web đặt vé xem phim hiện đại, được xây dựng với kiến trúc microservices, bao gồm frontend và backend riêng biệt.

## 🎯 Tính Năng Chính

- Đăng nhập và đăng ký tài khoản
- Xem danh sách phim đang chiếu
- Tìm kiếm phim theo tên, thể loại
- Xem chi tiết phim và lịch chiếu
- Đặt vé và chọn ghế
- Thanh toán trực tuyến
- Quản lý lịch sử đặt vé
- Hệ thống đánh giá và bình luận phim

## 🛠 Công Nghệ Sử Dụng

### Frontend

- React.js
- Bootstrap
- Axios

### Backend

- Java Spring Boot
- PostgreSQL
- Spring Security
- Spring Data JPA

## 🚀 Cài Đặt và Chạy Dự Án

### Yêu Cầu Hệ Thống

- Java JDK 17 trở lên
- Node.js (phiên bản 14.0.0 trở lên)
- PostgreSQL
- Maven
- npm hoặc yarn

### Cài Đặt Frontend

```bash
cd frontend
npm install
npm start
```

### Cài Đặt Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

## 📁 Cấu Trúc Dự Án

```
movie-ticket/
├── frontend/          # React frontend application
├── backend/           # Spring Boot backend server
└── README.md
```

## 🔐 Biến Môi Trường

Tạo file `application.properties` trong thư mục backend với các cấu hình sau:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/your_database
spring.datasource.username=your_username
spring.datasource.password=your_password

# Server Configuration
server.port=8080

# JWT Configuration
jwt.secret=your_jwt_secret
```
