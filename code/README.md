# Parking Management System - Hệ Thống Quản Lý Bãi Xe Thông Minh

## 📋 Tổng Quan

Hệ thống mô phỏng toàn bộ quy trình gửi và lấy xe cho một bãi xe đa tầng. Ứng dụng bao gồm:
- **Backend API** (Node.js/Express): Quản lý dữ liệu bãi xe, vé gửi, thanh toán
- **Frontend UI** (React/TypeScript): Giao diện kiosk tương tác cho người dùng

## 🚀 Các Tính Năng

### Gửi Xe (Submit Car)
1. Nhập biển số xe
2. Xem tình trạng tầng bãi (còn chỗ/gần đầy/đầy)
3. Chọn tầng để gửi xe
4. Xem sơ đồ tầng và chọn ô đỗ xe
5. Nhận vé gửi xe với thông tin vị trí và phí

### Lấy Xe (Retrieve Car)
1. Nhập mã vé gửi xe
2. Tra cứu vị trí đỗ xe (Tầng + Ô đỗ)
3. Thanh toán qua QR Code hoặc Thẻ POS
4. Xác nhận hoàn tất và mở Barie

## 📂 Cấu Trúc Thư Mục

```
code/
├── backend/
│   ├── server.js              # Express server entry point
│   ├── package.json           # Node.js dependencies
│   ├── models/
│   │   ├── Parking.js         # Core business logic
│   │   └── mock-data.js       # Mock database
│   └── routes/                # API endpoints (tích hợp trong server.js)
│
└── frontend/
    ├── src/
    │   ├── App.tsx            # Main app component
    │   ├── main.tsx           # React entry point
    │   ├── styles.ts          # Common styles
    │   ├── types/             # TypeScript interfaces
    │   ├── services/
    │   │   └── api.ts         # API client
    │   ├── components/
    │   │   ├── common/        # Button, Card, Modal, Spinner, Toast
    │   │   ├── features/      # FloorCard component
    │   │   └── layout/        # Header, Container
    │   └── pages/
    │       ├── Dashboard.tsx      # Main page
    │       ├── SubmitCarFlow.tsx  # Gửi xe workflow
    │       └── RetrieveCarFlow.tsx # Lấy xe workflow
    ├── index.html
    ├── vite.config.ts
    ├── tsconfig.json
    ├── package.json
    └── .env
```

## 🛠️ Cài Đặt & Chạy

### Yêu Cầu
- Node.js (v16+)
- npm hoặc yarn

### Backend Setup

```bash
cd code/backend
npm install
npm run dev
# Server chạy trên http://localhost:5000
```

**API Endpoints:**
- `GET /api/health` - Health check
- `GET /api/floors` - Get all floors info
- `GET /api/floors/:floorId/map` - Get detailed floor map
- `POST /api/cars/check-in` - Check in car
- `POST /api/tickets` - Generate parking ticket
- `GET /api/tickets/:ticketId` - Get ticket info
- `POST /api/cars/check-out` - Check out car
- `POST /api/payments` - Process payment

### Frontend Setup

```bash
cd code/frontend
npm install
npm run dev
# Frontend chạy trên http://localhost:3000
```

Frontend sẽ tự động proxy các yêu cầu API tới backend tại `http://localhost:5000`.

## 🧪 Thử Nghiệm Luồng

### Gửi Xe
1. Mở http://localhost:3000
2. Nhập biển số xe (VD: 52-F1 888.88)
3. Nhấn "Gửi Xe"
4. Chọn tầng (B1-B6)
5. Xem sơ đồ tầng và chọn ô đỗ trống (màu xanh)
6. Xác nhận nhận vé gửi xe

### Lấy Xe
1. Nhấn "Tra Cứu Vị Trí Xe"
2. Nhập mã vé (VD: #P-8821 hoặc #P-8822 từ mock data)
3. Xem vị trí đỗ xe
4. Chọn phương thức thanh toán (QR hoặc POS)
5. Nhấn "Hoàn Thành Thanh Toán"

## 💾 Dữ Liệu Mock

Backend sử dụng in-memory storage + JSON file (`mock-data.js`):
- **6 tầng bãi** (B1-B6), mỗi tầng 4 khu (A, B, C, D) x 6 ô
- **Mock tickets**: #P-8821, #P-8822 (có thể tra cứu ngay)
- **Dữ liệu sẽ reset** khi restart server

## 🎨 Thiết Kế UI

- **Responsive & Kiosk-friendly**: Giao diện đơn giản, ít thao tác
- **Màu sắc & Tương phản**: Phù hợp cho kiosk touchscreen
- **Feedback tức thì**: Loading spinner, toast messages
- **Micro-interactions**: Smooth transitions giữa các màn hình

## 📊 Data Models

### Floor
- `id`: B1-B6
- `capacity`: Tổng số chỗ
- `occupied`: Số chỗ đã dùng
- `status`: AVAILABLE | NEARLY_FULL | FULL

### Ticket
- `id`: Mã vé (#P-XXXX)
- `carId`: Xe liên kết
- `floor`, `slot`: Vị trí đỗ
- `fee`: Phí gửi (tính theo giờ)
- `paymentStatus`: UNPAID | PAID

### Payment
- `method`: QR | POS
- `amount`: Số tiền
- `status`: COMPLETED | FAILED

## 🔄 API Flow Example

```
Frontend (React) 
    ↓ POST /api/cars/check-in
Backend (Express)
    ↓ Store car in memory
    ↓ Return carId
Frontend
    ↓ POST /api/tickets with carId
Backend
    ↓ Generate ticket, allocate floor/slot
    ↓ Return ticket info
Frontend
    ↓ Display ticket confirmation
```

## 📝 Ghi Chú

- **In-memory storage**: Dữ liệu mất khi restart server (phù hợp mô phỏng)
- **CORS enabled**: Frontend và backend tương tác cross-origin
- **No authentication**: Hệ thống demo, không có auth/security
- **Mock data**: Mã vé `#P-8821`, `#P-8822` có thể tra cứu để test RetrieveCarFlow

## 🚀 Phát Triển Tiếp

Để mở rộng hệ thống:
1. **Thêm database**: Thay in-memory bằng MongoDB, PostgreSQL
2. **Authentication**: Thêm login, JWT tokens
3. **Real-time**: WebSocket cho cập nhật tầng realtime
4. **Analytics**: Thêm lịch sử gửi/lấy xe, thống kê
5. **Mobile app**: React Native hoặc Flutter
6. **QR generation**: Thêm thư viện QR code thực
7. **Notification**: Email/SMS xác nhận gửi/lấy xe

## 📖 Tài Liệu Thêm

Xem [SOFTWARE_SPEC.md](./SOFTWARE_SPEC.md) để biết chi tiết kiến trúc hệ thống, API specification, và business logic.

---

**Status**: ✅ Hoàn thành & sẵn sàng thử nghiệm
**Last Updated**: 2026-09-01
