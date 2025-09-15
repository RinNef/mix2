# mix2

This repository contains a minimal scaffold for a Homestay management system:

- `backend/`: Node.js + Express API (file-based storage initially, can be switched to MySQL/XAMPP)
- `admin/`: React + Material UI admin panel
- `uploads/`: local storage for uploaded images

Quick start (local development):

1. Install backend dependencies and run server:

```bash
cd backend
npm install
cp .env.example .env
# edit .env as needed (DB config, JWT secret)
npm run dev
```

2. Install admin and run frontend:

```bash
cd admin
npm install
npm start
```

The admin calls backend routes under `/api/...` so run both services and use a proxy or run admin with `PORT=3000` and backend at `PORT=4000`.

Notes:
- The current backend uses a JSON file under `data/homestays.json` for simplicity. You can connect to MySQL (XAMPP) by implementing DB calls in `backend/src/controllers/homestays.js`.
- Image uploads are saved to `uploads/` and served from `/uploads` route.
- Google Maps integration should be added in the admin UI where address is edited (store `googleMapEmbed`).
Node.js + Express.js
XAMPP (nên là để chạy MySQL cục bộ)
Lưu ảnh nội bộ (local storage)
Tích hợp Google Maps API

🎯 Tính năng cần có:

1. Quản lý Homestay:

Tên homestay

Số lượng/phòng

Địa chỉ (tích hợp Google Maps)

Ảnh homestay (.jpg/.png)

Danh sách đồ dùng trong phòng (kèm ảnh)

Thông tin liên hệ

Thời gian đã đặt / chưa đặt (lịch đặt phòng)

2. Admin Panel:

Dashboard tổng quan

Chức năng thêm/sửa/xoá Homestay

Quản lý lịch đặt phòng

Giao diện upload ảnh (file .jpg/.png)

Giao diện trực quan dễ dùng



📋 Admin Panel:

React.js + Material UI

📁 Cấu trúc dữ liệu mẫu:
🔸 Collection: Homestays
{
  "_id": "uuid",
  "name": "Homestay Đà Lạt view rừng",
  "address": "Đường X, Phường Y, Đà Lạt, Lâm Đồng",
  "googleMapEmbed": "https://maps.google.com/....",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "rooms": [
    {
      "roomName": "Phòng đôi 1",
      "amenities": [
        {
          "name": "Máy sấy",
          "image": "https://example.com/hairdryer.png"
        },
        {
          "name": "Máy lạnh",
          "image": "https://example.com/aircon.png"
        }
      ],
      "availability": [
        {
          "date": "2025-09-15",
          "isBooked": true
        },
        {
          "date": "2025-09-16",
          "isBooked": false
        }
      ]
    }
  ],
  "contact": {
    "phone": "0901234567",
    "email": "example@email.com",
    "zalo": "https://zalo.me/..."
  }
}

✅ Các bước triển khai cụ thể:
1. Xây dựng API Backend

GET /homestays – lấy danh sách homestay

GET /homestays/:id – lấy chi tiết 1 homestay

POST /homestays – tạo mới homestay

PUT /homestays/:id – cập nhật

DELETE /homestays/:id – xoá

2. Authentication

POST /admin/login – Đăng nhập Admin (JWT Token)

Middleware authAdmin để bảo vệ route thêm/sửa/xoá

3. Upload ảnh

Tích hợp Cloudinary hoặc Firebase

Tạo form trong Cpanel cho phép upload ảnh và lưu link

4. Cpanel Admin

Trang đăng nhập

Giao diện quản lý:

Danh sách homestay (table)

Chi tiết từng homestay (modal hoặc trang riêng)

CRUD homestay

Upload ảnh

Quản lý lịch đặt phòng (calendar + date-picker)