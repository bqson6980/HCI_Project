# Software Builder Skill

## Purpose
Hướng dẫn AI phân tích yêu cầu, thiết kế kiến trúc hệ thống, và phát triển phần mềm mô phỏng đầy đủ (full-stack) cho hệ thống quản lý bãi xe, bao gồm Backend API và Frontend UI tương tác.

## Domain Knowledge
- **System Architecture & Design Patterns:** Tổ chức backend theo REST API, middleware separation, data layer decoupling.
- **Backend Development (Node.js/Express):** Server setup, routing, request/response handling, middleware, error handling, mock data persistence.
- **Frontend Integration:** React state management, API calls (fetch/axios), error handling, loading states, data flow từ server.
- **User-Centered Design (UCD):** Đảm bảo giao diện phản ánh chính xác user flow từ persona, giảm bớt friction, phản hồi tức thì.
- **Parking System Domain Knowledge:** Quản lý slot đỗ, tính phí theo thời gian, thanh toán, tra cứu xe, vé gửi.

## Reasoning & Implementation Strategy

### 1. Phân tích Yêu cầu (Requirements Analysis)
- **Ground Truth Source:** Đọc persona Nguyễn Văn Duy tại `data/persona/persona_nguyen_van_duy.md`.
- **User Flow Inference:**
  - Gửi xe: Overview tầng → Nhận thẻ → Chọn vị trí → Đỗ xe → Hoàn tất.
  - Lấy xe: Quẹt thẻ → Tra cứu vị trí → Thanh toán → Mở Barie → Ra bãi.
- **Feature Extraction:** Xác định tính năng bắt buộc vs. tùy chọn dựa trên pain points.
  - Bắt buộc: Floor availability realtime, Ticket generation, Position tracking, Payment.
  - Tùy chọn: History, Analytics, Notifications.

### 2. Thiết kế Kiến trúc (Architecture Design)

#### Backend Structure
```
code/
├── server.js (Express entry point)
├── routes/
│   ├── floors.js (GET /api/floors - list tầng)
│   ├── tickets.js (POST /api/tickets - cấp vé, GET /api/tickets/:id - tra cứu)
│   ├── cars.js (POST /api/cars - ghi nhận xe vào)
│   └── payments.js (POST /api/payments - xử lý thanh toán)
├── models/
│   ├── Parking.js (quản lý toàn bộ data)
│   ├── Floor.js, Slot.js, Car.js, Ticket.js, Payment.js
│   └── mock-data.js (khởi tạo dữ liệu mẫu)
├── middleware/
│   ├── errorHandler.js
│   └── corsHandler.js
└── utils/
    ├── calculations.js (tính phí, trạng thái slot)
    └── validators.js (validate input)
```

#### Frontend Structure
```
code/
├── src/
│   ├── components/
│   │   ├── common/ (Button, Card, Modal, Spinner)
│   │   ├── features/
│   │   │   ├── SubmitCar/ (Overview, ReceiveTicket, SelectFloor, ParkCar)
│   │   │   ├── RetrieveCar/ (CheckPosition, Payment)
│   │   │   └── FloorMap/ (visualization)
│   │   └── layout/ (Header, Footer, Navigation)
│   ├── pages/
│   │   ├── Dashboard.tsx (entry point)
│   │   ├── SubmitCarFlow.tsx
│   │   └── RetrieveCarFlow.tsx
│   ├── services/
│   │   └── api.ts (axios/fetch wrapper, API calls)
│   ├── hooks/
│   │   └── useParking.ts (custom hook for parking logic)
│   ├── types/
│   │   └── index.ts (TypeScript interfaces)
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

### 3. Data Models Definition
```typescript
// Floor
interface Floor {
  id: string;        // "B1", "B2", ..., "B6"
  name: string;      // "Tầng B1"
  capacity: number;  // 100 (total slots)
  occupied: number;  // 45 (occupied slots)
  status: "AVAILABLE" | "NEARLY_FULL" | "FULL";
  sections: Section[]; // A, B, C, D
}

// Slot
interface Slot {
  id: string;           // "A1", "A2", ..., "D20"
  floorId: string;      // "B2"
  sectionId: string;    // "A"
  status: "EMPTY" | "OCCUPIED" | "RESERVED";
  carId?: string;       // linked car if occupied
}

// Car
interface Car {
  id: string;           // auto-generated or license plate
  licensePlate: string; // "52-F1 888.88"
  entryTime: Date;
  exitTime?: Date;
  floor?: string;       // parked floor
  slot?: string;        // parked slot
}

// Ticket
interface Ticket {
  id: string;           // "#P-8821"
  carId: string;
  entryTime: Date;
  exitTime?: Date;
  floor?: string;
  slot?: string;
  fee: number;          // in VND
  paymentStatus: "UNPAID" | "PAID";
  paymentMethod?: "QR" | "POS";
}

// Payment
interface Payment {
  id: string;
  ticketId: string;
  amount: number;
  method: "QR" | "POS" | "CASH";
  timestamp: Date;
  status: "PENDING" | "COMPLETED" | "FAILED";
}
```

### 4. API Endpoints Specification

#### GET /api/floors
- Response: List of 6 floors (B1-B6) with current availability.
- Usage: Overview screen - hiển thị tầng còn chỗ.

#### POST /api/cars/check-in
- Request: { licensePlate: string }
- Response: { carId, entryTime }
- Usage: Ghi nhận xe vào bãi.

#### POST /api/tickets
- Request: { carId }
- Response: Ticket object (mã vé, phí tính sơ bộ)
- Usage: Cấp vé gửi xe.

#### GET /api/tickets/:id
- Response: Ticket object with parked floor/slot.
- Usage: Tra cứu vị trí xe.

#### POST /api/cars/check-out
- Request: { ticketId }
- Response: { carId, exitTime, totalFee }
- Usage: Ghi nhận xe rời khỏi bãi.

#### POST /api/payments
- Request: { ticketId, amount, method: "QR" | "POS" }
- Response: { paymentId, status: "COMPLETED" }
- Usage: Xử lý thanh toán.

### 5. Frontend Implementation Strategy

#### State Management (React Hooks)
- Global context: ParkingContext để lưu trữ floors, current ticket, payment status.
- Local component state: Loading, error, form inputs.
- API integration: useEffect → fetch data on mount/dependency change.

#### User Flow Implementation
**Submit Car Flow:**
1. Dashboard → Display all floors (GET /api/floors).
2. User select floor → Navigate to SelectFloor screen.
3. SelectFloor → Display floor map (sections & slots).
4. User select slot → Trigger POST /api/tickets, GET result.
5. ReceiveTicket → Display ticket (#P-8821) & confirmation.

**Retrieve Car Flow:**
1. Dashboard → Navigation to RetrieveCar.
2. CheckPosition → Prompt user to tap card (simulate).
3. User "tap" → POST /api/cars/check-out (or GET /api/tickets/:id).
4. Display floor & position result.
5. Navigate to Payment screen.
6. Payment → Display total fee + QR code.
7. User scan QR or tap POS → POST /api/payments.
8. Confirmation → Show payment success & barrier open message.

#### UI/UX Best Practices (Per Persona Nguyễn Văn Duy)
- **Minimize Steps:** Direct flow, no unnecessary screens.
- **Clear Feedback:** Loading spinner, success/error toast messages.
- **High Contrast:** Easy to read from distance (Kiosk usage).
- **Responsive Touch:** Large touch targets (Button, Card) for quick interaction.
- **Micro-interactions:** Smooth transitions between screens, color feedback on button clicks.

### 6. Implementation Workflow

#### Step 1: Backend Setup
- Initialize Node.js project (package.json, dependencies: express, cors, body-parser).
- Create Express server, CORS middleware.
- Define routes structure and mock data.
- Test API endpoints using curl/Postman.

#### Step 2: Frontend Setup
- Initialize React + TypeScript + Vite.
- Install dependencies: axios, react-router-dom, tailwindcss.
- Setup file structure (components, pages, services, types).
- Create base API client wrapper (axios instance).

#### Step 3: Core Backend Logic
- Implement Parking model (manage all data).
- Implement Floor availability calculation.
- Implement Ticket generation & Car tracking.
- Implement Payment processing logic.

#### Step 4: Core Frontend Components
- Build atomic components (Button, Card, Modal, Spinner, Badge).
- Build FloorMap visualization component.
- Build Form components (Input, Select).
- Build Layout components (Header, Container).

#### Step 5: Feature Integration
- Implement SubmitCarFlow screens (Overview → Ticket → FloorMap → Confirmation).
- Implement RetrieveCarFlow screens (Position check → Payment).
- Connect API calls for each screen.
- Handle loading & error states.

#### Step 6: Polish & Optimization
- Add animations (screen transitions, button feedback).
- Optimize performance (memoization, lazy loading).
- Improve error messages & validation.
- Test all flows end-to-end.

## Validation Rules
- **Backend Correctness:**
  - API responses match expected data structures.
  - Business logic correct (floor availability, fee calculation, ticket tracking).
  - Error handling for invalid inputs.

- **Frontend Correctness:**
  - UI matches prototype layout (prototype tại `output/prototype`).
  - All user flows (submit & retrieve) execute without errors.
  - API calls send/receive correct data.
  - Loading states displayed during async operations.

- **User Experience:**
  - Giao diện intuitive, ít thao tác (matching persona Nguyễn Văn Duy).
  - Phản hồi tức thì (feedback states, animations).
  - Dễ đọc, màu sắc tương phản.
  - Xử lý lỗi graceful (user-friendly error messages).

- **Code Quality:**
  - No TypeScript compilation errors.
  - No runtime errors or console warnings.
  - Components reusable, well-organized.
  - Comments explaining complex logic.

## Failure & Clarification Handling
- **Ambiguous Logic:** Nếu yêu cầu về business logic chưa rõ (VD: phí tính theo giờ hay ngày?), phải liệt kê rõ giả định và xin xác nhận user trước khi implement.
- **Missing Specification:** Nếu persona hoặc prototype thiếu chi tiết nào, phải nêu câu hỏi và đề xuất giải pháp hợp lý.
- **Visual Mismatch:** Nếu phát hiện giao diện dựng ra sai lệch so với prototype, phải lập tức fix và báo cáo sự khác biệt.
- **Auto-Fix Logic:** Nếu phát hiện lỗi logic hoặc UX không hợp lý, hãy tự sửa ngay và giải thích lý do sửa đổi.

## Integration with Project Structure
- **Ground Truth:** Luôn tham khảo `data/persona` và `data/ui_design` làm nguồn dữ liệu gốc.
- **Best Practices:** Áp dụng quy tắc HCI từ `rules/hci.md` và quy chuẩn từ `rules/quality.md`, `rules/reasoning.md`.
- **Reuse Patterns:** Tham khảo cấu trúc wireframe/prototype tại `output/` để consistency.
- **Documentation:** Ghi lại Specification chi tiết vào `code/SOFTWARE_SPEC.md`.
- **Versioning:** Giữ code trong `code/` folder, không tạo duplicate tại `output/`.
