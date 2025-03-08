# 🏆 Olympic Back-End App

Olympic Back-End App là một ứng dụng back-end được xây dựng bằng Node.js và Express.js, sử dụng MySQL làm cơ sở dữ liệu và hỗ trợ WebSocket thông qua Socket.io. Ứng dụng cung cấp API phục vụ cho hệ thống Olympic, bao gồm quản lý người dùng, xác thực, lưu trữ dữ liệu, và giao tiếp thời gian thực.

## 📌 Công nghệ sử dụng
- **Node.js**: Môi trường runtime cho JavaScript.
- **Express.js**: Framework để xây dựng API nhanh và linh hoạt.
- **MySQL + Sequelize**: Hệ quản trị cơ sở dữ liệu quan hệ và ORM.
- **Redis**: Lưu trữ cache và xử lý phiên.
- **Socket.io**: Hỗ trợ giao tiếp thời gian thực (WebSocket).
- **JWT (jsonwebtoken)**: Xác thực người dùng.
- **bcryptjs**: Hash mật khẩu.
- **dotenv**: Quản lý biến môi trường.

## 🚀 Cài đặt

### 1️⃣ Yêu cầu hệ thống
- **Node.js** (>= 14.x)
- **MySQL** (Cài đặt và chạy MySQL server)
- **Redis** (Tùy chọn, nếu sử dụng caching)

### 2️⃣ Cấu hình môi trường
Tạo tệp `.env` trong thư mục gốc và thêm các biến môi trường:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=olympic_db
JWT_SECRET=your_secret_key
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

### 3️⃣ Cài đặt package
Chạy lệnh sau để cài đặt tất cả dependencies:

```
npm install
```

## 🎯 Chạy ứng dụng

```
npm start
```
