# 🚀 HƯỚNG DẪN KHỞI CHẠY PHẦN MỀM (QUICKSTART)

## 📋 Tóm Tắt

Phần mềm gồm 2 thành phần chính:
1. **Backend**: Express Server (Node.js) — chạy trên cổng **5000** (`http://localhost:5000`)
2. **Frontend**: React + Vite Web Kiosk — chạy trên cổng **3000** (`http://localhost:3000`)

---

## 🔧 Cài Đặt & Khởi Động

### Bước 1: Khởi động Backend Server

Mở Terminal #1:
```bash
cd code/backend
npm install
npm run dev
```

**Kết quả thành công:**
```text
🚗 Parking Management Server is running on http://localhost:5000
📋 API Documentation:
   - GET  /api/health
   - GET  /api/floors
   - GET  /api/floors/:floorId/map
   - POST /api/cars/check-in
   - POST /api/tickets
   - GET  /api/tickets/:ticketId
   - POST /api/cars/check-out
   - POST /api/payments
```

---

### Bước 2: Khởi động Frontend Kiosk

Mở Terminal #2:
```bash
cd code/frontend
npm install
npm run dev
```

**Kết quả thành công:**
```text
  VITE v8.x.x  ready in XXX ms

  ➜  Local:   http://localhost:3000/
```

Mở trình duyệt truy cập: **`http://localhost:3000`**.

---

## 🎯 Luồng Kiểm Thử (6 Bước Hoàn Chỉnh)

1. **Xem Tổng quan (Tab 1):** Nắm bắt số chỗ còn trống của 6 tầng B1 - B6.
2. **Lấy thẻ vào bãi (Tab 2):** Nhấn `PRESS TO RECEIVE CARD` ➔ Chọn tầng gửi xe trên popup ➔ Nhận thẻ điện tử.
3. **Xem Sơ đồ phân khu (Tab 3):** Quan sát 4 phân khu A, B, C, D theo từng cụm 20 chỗ.
4. **Lưu vị trí đỗ (Tab 4):** Chọn cụm xe và lưu vị trí (ràng buộc 1 xe chỉ lưu 1 vị trí).
5. **Tra cứu vị trí (Tab 5):** Quẹt thẻ tra cứu ➔ Xem dải ruy-băng đỏ nét đứt chỉ đường thông minh qua hành lang.
6. **Thanh toán & Ra bãi (Tab 6):** Quẹt thẻ tính tiền ➔ Quét QR Code hoặc Chạm thẻ POS ➔ Mở Barie rời bãi.
