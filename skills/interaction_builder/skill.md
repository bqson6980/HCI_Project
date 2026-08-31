# Interaction Builder Skill

## Purpose

Hướng dẫn AI triển khai kiến trúc Backend-Frontend cho hệ thống bãi đỗ xe với 5 màn hình, quản lý trạng thái tầng/khu/ô, API layer (mock), và mô phỏng luồng gửi-lấy xe hoàn chỉnh. **Không storage persistent (tất cả in-memory).**

## Architecture Overview

```
┌──────────────────────────────────────────────────┐
│                   Frontend (React UI)             │
│  - 5 Screens, Event handling, Form input         │
│  - Display management, User interaction           │
└──────────────────┬───────────────────────────────┘
                   │ API Calls (Promise-based mock)
┌──────────────────▼───────────────────────────────┐
│            Backend Service Layer                  │
│  - Parking Logic (fee, slot availability)        │
│  - Transaction Management                         │
│  - State Orchestration                           │
│  - Mock Data Generation (in-memory)              │
└──────────────────────────────────────────────────┘
```

## Domain Knowledge

- **Parking System Flow:** 11 bước: Nhận diện biển → Tổng quan → Chọn tầng → Sơ đồ tầng → Quẹt lưu vị trí → Đỗ xe → Quẹt tra cứu → Lấy xe → Quẹt cổng → Chọn phương thức → Thanh toán → Mở barie.
- **Backend Service Layer:** Xử lý logic business (tính phí theo giờ, quản lý trạng thái ô/tầng, mô phỏng giao dịch), không database/storage.
- **Frontend UI Layer:** 5 screens, event handlers, state binding, display logic.
- **API Contract (Mock):** Promise-based mock API endpoints (getParkingStatus, issueTick, checkPosition, payment, etc.) chạy in-memory.
- **Mock Data Store:** Toàn bộ dữ liệu lưu trong memory (không localStorage, sessionStorage, database).
- **Event-Driven Design:** Tương tác người dùng (quẹt thẻ, chọn ô, thanh toán) trigger backend service → trả về kết quả → frontend cập nhật UI.

## Reasoning & Implementation Strategy

### 1. Backend Service Layer Architecture

**File: `services/ParkingService.ts`** (Mock Backend)

- **In-Memory State:** Toàn bộ dữ liệu (floors, transactions, slots) lưu trong RAM, mất khi reload.
- **Core Services:**
  - `ParkingService.getParkingStatus()` → Trả về 6 tầng + trạng thái ô (occupied/free)
  - `ParkingService.issueTick(bikeNumber)` → Mock ANPR, sinh thẻ (P-XXXX), lưu entry time
  - `ParkingService.saveSlot(ticketId, floor, area, slot)` → Cập nhật vị trí đỗ, mark slot as occupied
  - `ParkingService.checkPosition(ticketId)` → Truy vấn vị trí đã lưu
  - `ParkingService.calculateFee(entryTime, exitTime)` → Tính phí theo khung giờ
  - `ParkingService.processPayment(ticketId, amount, method)` → Mock thanh toán

### 2. Frontend UI Layer Architecture

**File: `src/App.tsx`** + Screen Components

- **Screen 1 (Tổng quan):** Display floor list from backend → `getParkingStatus()` → Render UI
- **Screen 2 (Nhận thẻ):** Mock ANPR + `issueTick()` → Hiển thị thẻ được phát
- **Screen 3 (Sơ đồ tầng):** Grid slots → User click → `saveSlot()` + transition
- **Screen 4 (Tra cứu):** Input ticket ID → `checkPosition()` → Display location
- **Screen 5 (Thanh toán):** 3 steps — Tap card → Select method → `processPayment()` → Success

### 3. API Contract (Promise-based Mock)

```typescript
// Ví dụ:
const result = await parkingAPI.issueTick({ bikeNumber: "52-F1 888.88" });
// Returns: { ticketId: 'P-8821', entryTime: timestamp }

const fee = await parkingAPI.calculateFee({
  entryTime: timestamp1,
  exitTime: timestamp2,
});
// Returns: { amount: 4000, period: '3h 25m' }
```

### 4. Phân Tích Luồng 11 Bước (Entry → Retrieve → Exit)

**Entry Flow (1–6):**

1. ANPR nhận diện → `issueTick()`
2. Xem tổng quan → `getParkingStatus()`
3. Chọn tầng
4. Xem sơ đồ tầng
5. Click ô → `saveSlot()`
6. Đỗ xe xong

**Retrieve Flow (7):** 7. Quẹt thẻ tra cứu → `checkPosition()`

**Exit & Payment Flow (8–11):** 8. Quẹt thẻ cổng ra 9. Hiển thị phí → `calculateFee()` 10. Chọn phương thức thanh toán (QR/Card) 11. `processPayment()` → Mở barie

### 5. Vòng Lặp Tự Kiểm Tra

- Backend: Verify mock data consistency (slot state, ticket ID, fee calculation).
- Frontend: Verify UI updates match backend response, navigation follows flow.
- End-to-End: Simulate 11 steps without getting stuck or losing state.

## Validation Rules

- **Độ Chính Xác Luồng:** Entry (1–6) → Retrieve (7) → Exit+Payment (8–11) phải tuân thứ tự, không bị stuck.
- **Backend-Frontend Separation:** Backend service logic riêng biệt từ UI, Frontend chỉ gọi API mock.
- **API Response Correctness:** Mỗi API call phải trả về expected shape (ticketId, fee, position, payment status).
- **State Consistency:** Ticket ID, slot state, transaction status không mất khi navigate.
- **In-Memory Only:** Không sử dụng localStorage, sessionStorage, database—tất cả dữ liệu mất khi reload.
- **No Persistent Storage:** Mock data generator tạo ngẫu nhiên mỗi lần app load.
- **Executable Code:** Không compile error, runtime error, hoặc unhandled Promise rejection.

## Failure & Improvement Handling

Nếu phát hiện:

- Backend API không trả về dữ liệu đúng → fix service logic, add console logging.
- State inconsistency giữa screens → verify API response được lưu đúng trong React state.
- Navigation stuck → check state transitions và Promise resolution.
- Mock data không chân thực → improve random generators (biển số, phí tính toán).
- Storage persistence detected → remove localStorage/sessionStorage, confirm in-memory only.
