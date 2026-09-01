# SOFTWARE SPECIFICATION - Parking Management System

## 📋 Tổng Quan Hệ Thống

Hệ thống quản lý bãi xe thông minh là ứng dụng mô phỏng toàn bộ quy trình gửi và lấy xe cho một bãi xe đa tầng. Được thiết kế theo nguyên lý HCI (Human-Computer Interaction) với tiêu chí giảm số bước nhấn, tăng độ rõ ràng, và cung cấp phản hồi tức thì.

**Persona chính:** Nguyễn Văn Duy (28 tuổi, nhân viên văn phòng)
- Goal: Gửi/lấy xe dưới 3 phút, không lạc xe, thanh toán nhanh
- Pain points: Không biết tầng còn chỗ, quên vị trí xe, xếp hàng chờ

---

## 🏗️ Kiến Trúc Hệ Thống

### Client-Server Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Dashboard (Tổng quan bãi xe)                   │  │
│  │  SubmitCarFlow (Quy trình gửi xe)               │  │
│  │  RetrieveCarFlow (Quy trình lấy xe)             │  │
│  └──────────────────────────────────────────────────┘  │
│                          ↑↓                             │
│                     (HTTP/API)                          │
│                          ↑↓                             │
│                    ┌──────────────┐                    │
│                    │   Services   │ (API Client)       │
│                    └──────────────┘                    │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   Backend (Express)                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │  API Routes                                      │  │
│  │  ├── GET  /api/floors                           │  │
│  │  ├── GET  /api/floors/:floorId/map              │  │
│  │  ├── POST /api/cars/check-in                    │  │
│  │  ├── POST /api/tickets                          │  │
│  │  ├── GET  /api/tickets/:ticketId                │  │
│  │  ├── POST /api/cars/check-out                   │  │
│  │  └── POST /api/payments                         │  │
│  └──────────────────────────────────────────────────┘  │
│                          ↓                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Models & Business Logic                        │  │
│  │  ├── Parking (main controller)                  │  │
│  │  ├── Floor management                           │  │
│  │  ├── Ticket generation & tracking               │  │
│  │  └── Payment processing                         │  │
│  └──────────────────────────────────────────────────┘  │
│                          ↓                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Data Storage (In-memory + Mock data)           │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Data Models & Structures

### 1. Floor (Tầng Bãi Xe)
```typescript
interface Floor {
  id: string;                    // "B1", "B2", ..., "B6"
  name: string;                  // "Tầng B1"
  capacity: number;              // Total slots (100)
  occupied: number;              // Currently occupied
  available: number;             // capacity - occupied
  status: "AVAILABLE" | "NEARLY_FULL" | "FULL";
  occupancyPercent: number;      // 0-100%
  sections: Section[];           // A, B, C, D
}
```

**Trạng thái tầng:**
- `AVAILABLE`: ≤ 70% sử dụng
- `NEARLY_FULL`: 70-89% sử dụng
- `FULL`: ≥ 90% sử dụng

### 2. Section (Khu Vực trong Tầng)
```typescript
interface Section {
  id: string;                    // "A", "B", "C", "D"
  name: string;                  // "Khu A", "Khu B", ...
  slots: Slot[];                 // 6 slots per section
  available: number;             // Count of EMPTY slots
  total: number;                 // Total slots in section
}
```

### 3. Slot (Ô Đỗ Xe)
```typescript
interface Slot {
  id: string;                    // "1", "2", ..., "6"
  status: "EMPTY" | "OCCUPIED" | "RESERVED";
  carId: string | null;          // Linked car if occupied
}
```

### 4. Car (Xe Gửi)
```typescript
interface Car {
  id: string;                    // "CAR-XXXXXXXX" (UUID)
  licensePlate: string;          // "52-F1 888.88"
  entryTime: Date;               // Check-in timestamp
  exitTime?: Date;               // Check-out timestamp
  floor?: string;                // Parked floor
  slot?: string;                 // Parked slot
}
```

### 5. Ticket (Vé Gửi Xe)
```typescript
interface Ticket {
  id: string;                    // "#P-8821" (format: #P-XXXX)
  carId: string;                 // Linked car
  entryTime: Date;               // Entry time
  exitTime?: Date;               // Exit time
  floor?: string;                // Parking floor
  slot?: string;                 // Parking slot
  fee: number;                   // Fee in VND
  paymentStatus: "UNPAID" | "PAID";
  paymentMethod?: "QR" | "POS";
}
```

### 6. Payment (Thanh Toán)
```typescript
interface Payment {
  id: string;                    // "PAY-XXXXXXXX" (UUID)
  ticketId: string;              // Linked ticket
  amount: number;                // Amount in VND
  method: "QR" | "POS" | "CASH";
  timestamp: Date;
  status: "PENDING" | "COMPLETED" | "FAILED";
}
```

---

## 🔗 API Endpoints Specification

### 1. GET /api/health
**Purpose:** Health check

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2026-09-01T10:30:00.000Z"
}
```

---

### 2. GET /api/floors
**Purpose:** Get information about all parking floors

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "B1",
      "name": "Tầng B1",
      "capacity": 100,
      "occupied": 45,
      "available": 55,
      "status": "AVAILABLE",
      "occupancyPercent": 45
    },
    // ... B2-B6
  ]
}
```

---

### 3. GET /api/floors/:floorId/map
**Purpose:** Get detailed floor map with sections and slots

**Request:** `GET /api/floors/B2/map`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "B2",
    "name": "Tầng B2",
    "sections": [
      {
        "id": "A",
        "name": "Khu A",
        "slots": [
          { "id": "A1", "status": "EMPTY", "carId": null },
          { "id": "A2", "status": "OCCUPIED", "carId": "CAR-001" },
          { "id": "A3", "status": "EMPTY", "carId": null },
          // ... more slots
        ],
        "available": 4,
        "total": 6
      },
      // ... sections B, C, D
    ]
  }
}
```

---

### 4. POST /api/cars/check-in
**Purpose:** Register a car entering the parking

**Request:**
```json
{
  "licensePlate": "52-F1 888.88"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "CAR-a1b2c3d4",
    "licensePlate": "52-F1 888.88",
    "entryTime": "2026-09-01T10:30:00.000Z"
  }
}
```

---

### 5. POST /api/tickets
**Purpose:** Generate a parking ticket

**Request:**
```json
{
  "carId": "CAR-a1b2c3d4",
  "floorId": "B1",
  "slotId": "A1"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "#P-8821",
    "carId": "CAR-a1b2c3d4",
    "entryTime": "2026-09-01T10:30:00.000Z",
    "floor": "B1",
    "slot": "A1",
    "fee": 5000,
    "paymentStatus": "UNPAID",
    "paymentMethod": null
  }
}
```

**Fee Calculation:**
- 0-4 hours: 5,000 VND
- 4-12 hours: 10,000 VND
- 12+ hours (overnight): 15,000 VND

---

### 6. GET /api/tickets/:ticketId
**Purpose:** Retrieve ticket information (for car retrieval)

**Request:** `GET /api/tickets/%23P-8821`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "#P-8821",
    "carId": "CAR-a1b2c3d4",
    "entryTime": "2026-09-01T10:30:00.000Z",
    "floor": "B1",
    "slot": "A1",
    "fee": 5000,
    "paymentStatus": "UNPAID"
  }
}
```

---

### 7. POST /api/cars/check-out
**Purpose:** Register a car leaving the parking

**Request:**
```json
{
  "ticketId": "#P-8821"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "carId": "CAR-a1b2c3d4",
    "ticketId": "#P-8821",
    "exitTime": "2026-09-01T14:30:00.000Z",
    "totalFee": 10000,
    "floor": "B1",
    "slot": "A1"
  }
}
```

---

### 8. POST /api/payments
**Purpose:** Process payment for parking

**Request:**
```json
{
  "ticketId": "#P-8821",
  "amount": 10000,
  "method": "QR"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "PAY-a1b2c3d4",
    "ticketId": "#P-8821",
    "amount": 10000,
    "fee": 10000,
    "change": 0,
    "method": "QR",
    "status": "COMPLETED",
    "timestamp": "2026-09-01T14:35:00.000Z"
  }
}
```

---

## 🔄 User Workflows

### Workflow 1: Gửi Xe (Submit Car)

```
┌─────────────────────────────────────────────────────┐
│ 1. DASHBOARD                                        │
│    - Input: Biển số xe (VD: 52-F1 888.88)           │
│    - Action: Nhấn "Gửi Xe"                          │
│    - Backend: POST /api/cars/check-in               │
│    - Response: carId                                │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 2. SELECT FLOOR                                     │
│    - Display: GET /api/floors                       │
│    - Show: B1-B6 với tình trạng (trống/gần đầy)     │
│    - Action: Click floor (VD: B1)                   │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 3. FLOOR MAP                                        │
│    - Display: GET /api/floors/B1/map                │
│    - Show: Sơ đồ 4 khu (A, B, C, D) x 6 ô           │
│    - Highlight: Ô trống (xanh) vs đã có (xám)       │
│    - Action: Click ô trống (VD: A1)                 │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 4. GENERATE TICKET                                  │
│    - Backend: POST /api/tickets                     │
│    - Input: carId, floorId, slotId                  │
│    - Response: Ticket (#P-8821)                     │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 5. TICKET CONFIRMATION                              │
│    - Display: Vé (#P-8821), vị trí (B1-A1), phí     │
│    - Action: Nhấn "Hoàn Thành"                      │
│    - Result: Quay về Dashboard                      │
└─────────────────────────────────────────────────────┘
```

**Time Goal:** < 3 phút (Persona requirement)
**Steps:** 5 bước chính

---

### Workflow 2: Lấy Xe (Retrieve Car)

```
┌─────────────────────────────────────────────────────┐
│ 1. DASHBOARD → RETRIEVE                             │
│    - Action: Nhấn "Tra Cứu Vị Trí Xe"               │
│    - Transition: Chuyển sang RetrieveCarFlow        │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 2. CHECK TICKET                                     │
│    - Input: Mã vé (#P-8821)                         │
│    - Action: Quẹt thẻ (input thẻ/nhập mã)           │
│    - Backend: GET /api/tickets/:ticketId            │
│    - Response: Ticket với floor, slot                │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 3. POSITION INFORMATION                             │
│    - Display: Vị trí xe (B1 - A1)                   │
│    - Show: Floor + Slot + Fee                       │
│    - Action: Nhấn "Thanh Toán"                      │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 4. PAYMENT SELECTION                                │
│    - Choice: QR Code hoặc Thẻ POS                   │
│    - Display: QR code hoặc hướng dẫn chạm thẻ       │
│    - Action: Quét QR hoặc chạm thẻ                  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 5. PAYMENT PROCESSING                               │
│    - Backend: POST /api/payments                    │
│    - Input: ticketId, amount, method                │
│    - Response: Payment confirmed                    │
│    - Result: Barrier mở, quay về Dashboard          │
└─────────────────────────────────────────────────────┘
```

**Time Goal:** < 2 phút (Từ lấy vé đến thanh toán)
**Steps:** 5 bước chính

---

## 💾 Business Logic Rules

### 1. Floor Availability
```
if (occupied / capacity) <= 0.7:
  status = "AVAILABLE"
else if (occupied / capacity) <= 0.9:
  status = "NEARLY_FULL"
else:
  status = "FULL"
```

### 2. Fee Calculation
```
duration = exitTime - entryTime (in hours)

if duration <= 4:
  fee = 5,000 VND
else if duration <= 12:
  fee = 10,000 VND
else:
  fee = 15,000 VND
```

### 3. Ticket ID Generation
```
Format: #P-XXXX
Example: #P-8821
Generated from random 4-digit number
```

### 4. Car ID Generation
```
Format: CAR-XXXXXXXX (UUID)
Example: CAR-a1b2c3d4
Generated from UUID v4, truncated to 8 characters
```

### 5. Slot Allocation
- When generating ticket, slot status changes from EMPTY to OCCUPIED
- When checking out, slot returns to EMPTY
- Cannot allocate slot if already OCCUPIED

### 6. Payment Validation
```
if amount < ticket.fee:
  return error "Insufficient amount"

change = amount - ticket.fee
ticket.paymentStatus = "PAID"
```

---

## 🎨 Frontend Architecture

### Component Hierarchy
```
App
├── Header (navigation)
├── Container (layout wrapper)
├── Dashboard (main page)
│   ├── FloorCard (display floors)
│   ├── Button (CTA)
│   └── Input (license plate)
├── SubmitCarFlow
│   ├── Step 1: SelectFloor
│   │   └── FloorCard list
│   ├── Step 2: FloorMap
│   │   └── Slot grid
│   └── Step 3: TicketConfirmation
│       └── Card (ticket details)
├── RetrieveCarFlow
│   ├── Step 1: CheckTicket
│   │   └── Input (ticket ID)
│   ├── Step 2: PositionInfo
│   │   └── Card (position details)
│   └── Step 3: Payment
│       ├── PaymentMethodSelector
│       └── QR/POS display
└── Toast (notifications)
```

### State Management
- **App Level:** Global mode (dashboard/submit/retrieve)
- **Page Level:** Step tracking, form inputs
- **API Integration:** useEffect hooks, async/await

---

## 🔐 Error Handling

### Frontend Error Scenarios
1. **Network Error:** Show error toast, retry option
2. **Invalid Input:** Inline validation, error messages
3. **API Error:** Display error toast with message
4. **Timeout:** Show spinner, auto-retry after 3s

### Backend Error Scenarios
1. **Invalid Request:** Return 400 + error message
2. **Resource Not Found:** Return 404
3. **Server Error:** Return 500 + generic message
4. **Business Logic Violation:** Return 400 + specific error

### Example Error Response
```json
{
  "success": false,
  "error": "Ticket not found"
}
```

---

## 📊 Data Persistence

### Current Implementation
- **In-memory storage:** Maps for floors, cars, tickets, payments
- **Mock data:** Initialized from `mock-data.js`
- **Reset behavior:** Data lost on server restart

### For Production Migration
```
In-memory → JSON file (local dev)
         → MongoDB (cloud)
         → PostgreSQL (enterprise)
```

---

## 🚀 Performance Considerations

1. **API Response Time:** < 500ms target
2. **Frontend Render:** React optimization via useMemo, useCallback
3. **Component Reuse:** Atomic design (Button, Card, Modal)
4. **State Updates:** Minimal re-renders via Context API
5. **Network:** Proxy requests to reduce latency

---

## ✅ Testing Checklist

### Manual Testing
- [ ] Submit car workflow (E2E)
- [ ] Retrieve car workflow (E2E)
- [ ] Floor availability updates in real-time
- [ ] Payment methods (QR/POS) both work
- [ ] Error handling (invalid ticket, no capacity)
- [ ] UI responsiveness on different screen sizes

### API Testing
- [ ] All endpoints return correct response format
- [ ] Error scenarios handled properly
- [ ] Data consistency (occupied count matches)
- [ ] Fee calculation correct

### UX Testing
- [ ] Flow completes < 3 minutes (submit)
- [ ] Flow completes < 2 minutes (retrieve)
- [ ] UI clear and intuitive
- [ ] Feedback immediate and visible

---

## 📝 Future Enhancements

1. **Real-time Updates:** WebSocket for live floor capacity
2. **Authentication:** User login, stored history
3. **QR Generation:** Actual QR code library
4. **Notifications:** SMS/Email confirmations
5. **Analytics:** Parking statistics, revenue reports
6. **Mobile App:** Native iOS/Android
7. **Integration:** Payment gateway (MoMo, VNPay)
8. **Multi-language:** Support Vietnamese, English
9. **Accessibility:** WCAG compliance, screen reader support
10. **Performance:** Caching, CDN, database indexing

---

**Document Version:** 1.0  
**Last Updated:** 2026-09-01  
**Status:** ✅ Complete & Ready for Testing
