# 🚀 HƯỚNG DẪN CHẠY PHẦN MỀM

## 📋 Tóm Tắt

Phần mềm gồm 2 thành phần chính:
1. **Backend**: Express server (Node.js) - chạy trên port 5000
2. **Frontend**: React app (Vite) - chạy trên port 3000

⏱️ **Thời gian setup:** ~5 phút (khi npm packages đã tải)

---

## ✅ Yêu Cầu Hệ Thống

- **Node.js**: v16 trở lên
- **npm** hoặc **yarn**
- **Terminal/PowerShell** để chạy commands
- **2 cửa sổ terminal** (một cho backend, một cho frontend)

Kiểm tra:
```bash
node --version    # Phải >= v16.x.x
npm --version     # Phải >= 7.x.x
```

---

## 🔧 Cài Đặt (Lần Đầu Tiên)

### Bước 1: Cài đặt Dependencies cho Backend

```bash
# Mở terminal tại thư mục dự án
cd d:\Year\ 3\Tương\ tác\ người\ máy\HCI_Project\code\backend

# Cài npm packages
npm install

# ✅ Hoàn tất khi thấy: "added X packages"
```

### Bước 2: Cài đặt Dependencies cho Frontend

```bash
# Mở terminal khác (hoặc terminal mới)
cd d:\Year\ 3\Tương\ tác\ người\ máy\HCI_Project\code\frontend

# Cài npm packages
npm install

# ✅ Hoàn tất khi thấy: "added X packages"
```

---

## 🏃 Chạy Phần Mềm

### Bước 3: Chạy Backend

**Terminal #1:**
```bash
cd d:\Year\ 3\Tương\ tác\ người\ máy\HCI_Project\code\backend
npm run dev
```

**Kết quả mong muốn:**
```
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

✅ Backend chạy thành công khi thấy dòng trên. **Không tắt terminal này!**

---

### Bước 4: Chạy Frontend

**Terminal #2 (mở terminal khác):**
```bash
cd d:\Year\ 3\Tương\ tác\ người\ máy\HCI_Project\code\frontend
npm run dev
```

**Kết quả mong muốn:**
```
  VITE v4.4.5  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

✅ Frontend chạy thành công khi thấy dòng trên.

---

## 🌐 Truy Cập Ứng Dụng

Mở trình duyệt và truy cập:

```
http://localhost:3000
```

🎉 **Bạn sẽ thấy Dashboard với các tính năng:**
- 📤 Gửi Xe (input biển số)
- 📊 Tình trạng các tầng (B1-B6)
- 📥 Lấy Xe (tra cứu vị trí)

---

## 🧪 Thử Nghiệm Các Luồng

### Test 1: Gửi Xe

1. Trên Dashboard, nhập biển số: `52-F1 888.88`
2. Nhấn nút "Gửi Xe" 🚗
3. Chọn tầng (VD: B1)
4. Xem sơ đồ tầng, chọn ô trống (màu xanh)
5. Nhân vé gửi xe (#P-XXXX)

⏱️ **Mục tiêu:** Hoàn thành trong < 3 phút ✅

---

### Test 2: Lấy Xe

1. Nhấn nút "Tra Cứu Vị Trí Xe" 🔍
2. Nhập mã vé: `#P-8821` (hoặc `#P-8822`)
3. Xem vị trí xe (Tầng + Ô đỗ)
4. Nhấn "Thanh Toán"
5. Chọn phương thức (QR hoặc POS)
6. Nhấn "Hoàn Thành Thanh Toán"

⏱️ **Mục tiêu:** Hoàn thành trong < 2 phút ✅

---

## 🔄 Kiểm Tra API

Để kiểm tra API trực tiếp (không dùng Frontend):

### Cách 1: Dùng PowerShell

```powershell
# Kiểm tra health
Invoke-RestMethod -Uri "http://localhost:5000/api/health"

# Lấy danh sách tầng
Invoke-RestMethod -Uri "http://localhost:5000/api/floors"

# Gửi xe (check-in)
$body = @{ licensePlate = "52-F1 888.88" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/cars/check-in" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

### Cách 2: Dùng Postman/Insomnia
1. Tải Postman: https://www.postman.com/downloads/
2. Import/tạo requests tới các endpoints tại [SOFTWARE_SPEC.md](./SOFTWARE_SPEC.md)

---

## 🐛 Xử Lý Lỗi Thường Gặp

### ❌ Lỗi: "Port 5000 already in use"
**Giải pháp:** Cổng 5000 bị dùng bởi tiến trình khác
```powershell
# Tìm process dùng port 5000
netstat -ano | findstr :5000

# Kill process (thay PID)
taskkill /PID <PID> /F
```

### ❌ Lỗi: "npm: command not found"
**Giải pháp:** Node.js chưa được cài hoặc chưa restart terminal
```powershell
# Cài Node.js từ: https://nodejs.org/
# Hoặc khởi động lại PowerShell
```

### ❌ Lỗi: "Cannot GET /"
**Giải pháp:** Frontend chưa chạy hoặc URL sai
```
Đảm bảo:
1. Terminal #1 chạy backend (port 5000) ✅
2. Terminal #2 chạy frontend (port 3000) ✅
3. Truy cập http://localhost:3000 (không http://localhost:5000)
```

### ❌ Lỗi: "Failed to fetch" hoặc "API call error"
**Giải pháp:** Backend không chạy hoặc API route sai
```
Kiểm tra:
1. Terminal #1 có thấy "🚗 Parking Management Server is running"?
2. Mở http://localhost:5000/api/health (phải thấy {"status":"OK"})
3. Nếu vẫn lỗi, thử restart cả backend và frontend
```

---

## 📂 Cấu Trúc Folder Quan Trọng

```
code/
├── backend/
│   ├── server.js          ← Main server file
│   ├── package.json       ← Dependencies
│   └── models/
│       ├── Parking.js     ← Core logic
│       └── mock-data.js   ← Mock database
│
└── frontend/
    ├── src/
    │   ├── App.tsx        ← Main app
    │   ├── pages/         ← Dashboard, SubmitCarFlow, RetrieveCarFlow
    │   └── services/
    │       └── api.ts     ← API client
    └── package.json       ← Dependencies
```

---

## 💾 Dữ Liệu Mock

Hệ thống đi kèm mock data sẵn:

**Vé có thể tra cứu ngay:**
- `#P-8821` (Tầng B1, Ô A2)
- `#P-8822` (Tầng B1, Ô A4)

**Biển số xe để test:**
- `52-F1 888.88`
- `52-F1 777.77`
- `52-F1 666.66`

**⚠️ Lưu ý:** Dữ liệu mất khi restart server (in-memory storage)

---

## 📊 Giám Sát & Debug

### Xem logs Backend
Terminal Backend sẽ hiển thị tất cả API requests:
```
🚗 Parking Management Server is running on http://localhost:5000
[LOG] POST /api/cars/check-in - Success
[LOG] POST /api/tickets - Generated ticket #P-8821
```

### Xem logs Frontend
**Mở Developer Tools** (F12) → Console tab để thấy logs React/API calls

### Kiểm tra database in-memory
- Backend không có database file (lưu trong RAM)
- Xem [mock-data.js](./backend/models/mock-data.js) để biết data structure

---

## 🛑 Dừng Ứng Dụng

Khi muốn tắt:
1. **Backend terminal:** Nhấn `Ctrl+C`
2. **Frontend terminal:** Nhấn `Ctrl+C`
3. **Trình duyệt:** Đóng tab hoặc cửa sổ

---

## 🚀 Lệnh Hữu Ích

```bash
# Backend - Rebuild dependencies
cd code/backend
rm -r node_modules package-lock.json
npm install

# Frontend - Rebuild dependencies
cd code/frontend
rm -r node_modules package-lock.json
npm install

# Backend - Build production
npm run build

# Frontend - Build production
npm run build

# Clear cache
cd code/backend && npm cache clean --force
cd code/frontend && npm cache clean --force
```

---

## 📖 Tài Liệu Thêm

- **[README.md](./README.md)** - Tổng quan hệ thống
- **[SOFTWARE_SPEC.md](./SOFTWARE_SPEC.md)** - Kiến trúc & API chi tiết
- **[../skills/software_builder/plan.md](../skills/software_builder/plan.md)** - Kế hoạch phát triển
- **[../skills/software_builder/skill.md](../skills/software_builder/skill.md)** - Hướng dẫn chi tiết

---

## 📞 Hỗ Trợ & Câu Hỏi

### Vấn đề phổ biến:
- ❓ Lấy vé sai: Đảm bảo format `#P-8821` (chứ không `P-8821`)
- ❓ Port đang sử dụng: Thử port khác (VD: `PORT=5001 npm run dev`)
- ❓ API không phản hồi: Kiểm tra CORS - Frontend gọi tới `http://localhost:5000`

### Thiết kế UI:
- Dựa trên persona **Nguyễn Văn Duy**: Nhân viên văn phòng 28 tuổi
- Mục tiêu: Gửi/lấy xe trong < 3 phút, ít thao tác
- Quy tắc HCI: Giảm số bước, tăng độ rõ ràng, feedback tức thì

---

## ✨ Tính Năng Đã Hoàn Thành

✅ Backend API (8 endpoints)
✅ Frontend UI (3 pages: Dashboard, SubmitCarFlow, RetrieveCarFlow)
✅ Mock data (6 tầng bãi, 24 vé gửi mẫu)
✅ Business logic (phí gửi, trạng thái tầng, thanh toán)
✅ Error handling (validation, error messages)
✅ Responsive design (touchscreen-friendly)
✅ Micro-interactions (animations, transitions)
✅ Documentation (README, SPEC, Quick Start)

---

## 🎯 Tiếp Theo?

Sau khi test xong:
1. Đọc [SOFTWARE_SPEC.md](./SOFTWARE_SPEC.md) để hiểu kiến trúc
2. Explore code tại `code/backend` và `code/frontend`
3. Thử modify mock data hoặc UI styling
4. Deploy lên production (Docker, AWS, Heroku, etc.)

---

**Phiên bản:** 1.0  
**Cập nhật lần cuối:** 2026-09-01  
**Trạng thái:** ✅ Sẵn sàng chạy

Chúc bạn thử nghiệm vui vẻ! 🚗✨
