-- Tạo database nếu chưa tồn tại
CREATE DATABASE IF NOT EXISTS mix2 CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE mix2;

-- Tạo bảng homestays
CREATE TABLE IF NOT EXISTS homestays (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  googleMapEmbed TEXT,
  images TEXT COMMENT 'JSON array of image URLs',
  contact TEXT COMMENT 'JSON object with phone, email, zalo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tạo bảng rooms (phòng trong homestay)
CREATE TABLE IF NOT EXISTS rooms (
  id VARCHAR(36) PRIMARY KEY,
  homestay_id VARCHAR(36) NOT NULL,
  roomName VARCHAR(255) NOT NULL,
  amenities TEXT COMMENT 'JSON array of {name, image} objects',
  FOREIGN KEY (homestay_id) REFERENCES homestays(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tạo bảng availability (lịch phòng trống/đã đặt)
CREATE TABLE IF NOT EXISTS availability (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id VARCHAR(36) NOT NULL,
  date DATE NOT NULL,
  isBooked TINYINT(1) DEFAULT 0,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Thêm index cho tìm kiếm nhanh
CREATE INDEX idx_homestay_name ON homestays(name);
CREATE INDEX idx_room_homestay ON rooms(homestay_id);
CREATE INDEX idx_availability_room ON availability(room_id);
CREATE INDEX idx_availability_date ON availability(date);

-- Thêm dữ liệu mẫu
INSERT INTO homestays (id, name, address, googleMapEmbed, images, contact) VALUES
(
  'hs-001',
  'Homestay Đà Lạt View Rừng',
  '123 Đường ABC, Phường 1, Đà Lạt, Lâm Đồng',
  '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.857517244521!2d108.44611071481668!3d11.889741791546394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDUzJzIzLjEiTiAxMDjCsDI2JzUyLjAiRQ!5e0!3m2!1svi!2s!4v1632491112345!5m2!1svi!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>',
  '["uploads/sample1.jpg", "uploads/sample2.jpg"]',
  '{"phone": "0901234567", "email": "dalat@example.com", "zalo": "https://zalo.me/0901234567"}'
);

INSERT INTO rooms (id, homestay_id, roomName, amenities) VALUES
(
  'room-001',
  'hs-001',
  'Phòng Đôi View Rừng',
  '[
    {"name": "Máy lạnh", "image": "uploads/amenities/aircon.png"},
    {"name": "TV", "image": "uploads/amenities/tv.png"},
    {"name": "Wifi", "image": "uploads/amenities/wifi.png"},
    {"name": "Tủ lạnh", "image": "uploads/amenities/fridge.png"}
  ]'
),
(
  'room-002',
  'hs-001',
  'Phòng Gia Đình View Thành Phố',
  '[
    {"name": "Máy lạnh", "image": "uploads/amenities/aircon.png"},
    {"name": "TV", "image": "uploads/amenities/tv.png"},
    {"name": "Wifi", "image": "uploads/amenities/wifi.png"},
    {"name": "Bếp", "image": "uploads/amenities/kitchen.png"}
  ]'
);

-- Thêm dữ liệu lịch phòng mẫu (30 ngày tới)
INSERT INTO availability (room_id, date, isBooked)
SELECT 
  'room-001' as room_id,
  DATE_ADD(CURRENT_DATE, INTERVAL n DAY) as date,
  IF(n % 3 = 0, 1, 0) as isBooked
FROM (
  SELECT a.N + b.N * 10 as n
  FROM (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
       (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3) b
  WHERE a.N + b.N * 10 < 30
) numbers;

INSERT INTO availability (room_id, date, isBooked)
SELECT 
  'room-002' as room_id,
  DATE_ADD(CURRENT_DATE, INTERVAL n DAY) as date,
  IF(n % 4 = 0, 1, 0) as isBooked
FROM (
  SELECT a.N + b.N * 10 as n
  FROM (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
       (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3) b
  WHERE a.N + b.N * 10 < 30
) numbers;