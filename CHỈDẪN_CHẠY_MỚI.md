# 🚀 Hướng dẫn Chạy Prototype Frontend Mới (Match Prototype)

## ✅ Frontend đã được sửa hoàn toàn để match prototype

Frontend giờ sử dụng:
- **Tailwind CSS** (thay vì inline styles)
- **5 screens tương tác** giống prototype: Tổng quan → Nhận thẻ → Sơ đồ tầng → Tra cứu vị trí → Thanh toán
- **Tab-based navigation** (thay vì modal-based)
- **Color scheme**: Emerald (available), Amber (nearly full), Rose (full)
- **Typography**: Space Grotesk (headers), IBM Plex Sans (body), IBM Plex Mono (code)

## 📦 Yêu cầu

- Node.js 16+
- npm hoặc pnpm

## 🔧 Cài đặt & Chạy

### 1. Cài đặt Backend

```bash
cd code/backend
npm install
# Hoặc nếu đã cài: npm install là xong
```

### 2. Chạy Backend

```bash
cd code/backend
npm start
# Backend sẽ chạy tại http://localhost:5000
```

### 3. Cài đặt Frontend (Terminal mới)

```bash
cd code/frontend
npm install
```

### 4. Chạy Frontend Dev Server

```bash
cd code/frontend
npm run dev
# Frontend sẽ chạy tại http://localhost:5173
# Hoặc port khác nếu 5173 đang bận
```

### 5. Truy cập Ứng dụng

Mở trình duyệt: **http://localhost:5173**

## ✨ 5 Màn hình Tương tác

1. **Tổng quan (Overview)** - Xem công suất các tầng
2. **Nhận thẻ (Ticket)** - Nhập/quét biển số xe, nhận thẻ
3. **Sơ đồ tầng B2 (Floor Map)** - Xem sơ đồ chỗ trống từng khu
4. **Tra cứu vị trí (Check Position)** - Quẹt thẻ để tìm xe
5. **Thanh toán (Payment)** - Quẹt thẻ + thanh toán + mở barie

## 🎨 Styling

- Toàn bộ CSS dùng **Tailwind CSS**
- Fonts: Google Fonts (Space Grotesk, IBM Plex Sans, IBM Plex Mono)
- Responsive design (mobile-first)
- Dark mode gradient background

## ⚙️ Biến môi trường

Frontend đọc từ `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

## 🔌 API Integration

Frontend kết nối backend qua Axios:
- Base URL: `http://localhost:5000/api`
- Endpoints: `/floors`, `/tickets`, `/payments`, `/cars`

## 📝 Build cho Production

```bash
cd code/frontend
npm run build
# Output sẽ ở thư mục `dist/`
```

## ❌ Nếu gặp lỗi

1. **Port 5000/5173 đang bận**: Thay đổi port trong `vite.config.ts` hoặc `server.js`
2. **Module not found**: Chạy `npm install` lại
3. **Build error**: Xóa `node_modules` và `package-lock.json`, chạy `npm install` lại
4. **CORS error**: Kiểm tra backend có chạy tại `http://localhost:5000` không

## 🎯 Test Workflow

1. Truy cập **Tổng quan** → Xem các tầng B1-B6 với % đầy
2. Click **Nhận thẻ** → Nhập/quét biển số, nhấn "NHẤN NÚT LẤY THẺ"
3. Click **Sơ đồ tầng B2** → Xem grid 4 khu A,B,C,D
4. Click **Tra cứu vị trí** → Nhập mã thẻ, xem grid khu C với xe ở C4
5. Click **Thanh toán** → Chọn QR/Card, xác nhận thanh toán, mở barie

---

**Lưu ý**: Dữ liệu parking là mock data, không kết nối database thực
