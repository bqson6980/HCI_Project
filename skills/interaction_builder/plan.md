# Interaction Builder Plan - Parking System (Backend-Frontend Architecture)

## Purpose

Triển khai kiến trúc Backend-Frontend cho hệ thống bãi đỗ xe với:

- **Backend Service Layer:** Logic business, quản lý trạng thái, API endpoints (mock, in-memory).
- **Frontend UI Layer:** React components, 5 screens, event handling.
- **API Contract:** Promise-based mock API, không database hay storage persistent.
- **11-Step Flow:** Entry → Retrieve → Exit+Payment, chạy end-to-end.

## Use this skill when

- Prototype cơ bản có HTML/CSS wireframe.
- Cần xây dựng Backend Service Layer (mock API, business logic in-memory).
- Cần tích hợp Frontend UI với Backend API.
- Muốn kiểm tra end-to-end flow mà không database/backend thực.

## Required inputs

- Wireframe 5 màn hình + component hierarchy.
- Luồng 11 bước chi tiết: entry → retrieve → exit.
- Pricing rules, parking structure (6 tầng, 4 khu/tầng, ~24 ô/khu).

## Output

- `services/ParkingService.ts` — Backend service layer (mock API endpoints).
- `src/App.tsx` + Screen components — Frontend UI layer.
- `types/index.ts` — Shared TypeScript interfaces (API contract).
- End-to-end flow verification: 11 steps work without storage.

## Architecture Layers

```
┌──────────────────────────────────────────────────┐
│               FRONTEND UI LAYER (React)         │
│  Screen1: Overview | Screen2: Ticket             │
│  Screen3: FloorMap | Screen4: CheckPosition      │
│  Screen5: Payment | Event handlers               │
└───────────────┬───────────────────────────────┘
                    │ API Calls
┌───────────────▼───────────────────────────────┐
│               BACKEND SERVICE LAYER             │
│  — getParkingStatus()                            │
│  — issueTick(bikeNumber)                         │
│  — saveSlot(ticketId, floor, area, slot)       │
│  — checkPosition(ticketId)                       │
│  — calculateFee(entryTime, exitTime)            │
│  — processPayment(ticketId, amount, method)    │
└──────────────────────────────────────────────────┘
                       │
┌───────────────▼───────────────────────────────┐
│             IN-MEMORY MOCK DATA STORE          │
│  - Parking Slots (6 floors × 4 areas × 24 slots) │
│  - Active Tickets (in-memory map)               │
│  - Transaction Log (temporary)                  │
│  - Mock seed data (bike numbers, fake ANPR)     │
└──────────────────────────────────────────────────┘
```

## Workflow

### Phase 1: Backend Service Layer Design (1.5–2 giờ)

1. **Define Data Models** (`types/index.ts`):

   ```typescript
   type ParkingSlot = {
     floor: string;
     area: string;
     slot: string;
     occupied: boolean;
   };
   type Ticket = {
     id: string;
     bikeNumber: string;
     entryTime: number;
     floor?: string;
     area?: string;
     slot?: string;
   };
   type Transaction = {
     ticketId: string;
     entryTime: number;
     exitTime: number;
     fee: number;
     paid: boolean;
   };
   ```

2. **Design API Contract** (Mock endpoints):
   - `getParkingStatus(): Promise<{ floors: ParkingFloor[] }>`
   - `issueTick(bikeNumber): Promise<{ ticketId: string; entryTime: number }>`
   - `saveSlot(ticketId, floor, area, slot): Promise<{ success: boolean }>`
   - `checkPosition(ticketId): Promise<{ floor?: string; area?: string; slot?: string; error?: string }>`
   - `calculateFee(entryTime, exitTime): Promise<{ amount: number; period: string }>`
   - `processPayment(ticketId, amount, method): Promise<{ transactionId: string; success: boolean }>`

3. **In-Memory Data Store**:
   - Global state object holding all parking slots, active tickets, transactions.
   - No localStorage, sessionStorage, or database.
   - Data lost on page reload (acceptable for mock).

### Phase 2: Backend Service Implementation (2–2.5 giờ)

1. **Create `services/ParkingService.ts`**:
   - Initialize mock parking data: 6 floors, 4 areas/floor, ~24 slots/area.
   - Implement core logic:
     - `generateTicketId()`: Create unique ticket IDs (P-XXXX).
     - `calculateFeeByDuration()`: Tier-based fee (0-4h, 4-12h, 12+ h).
     - `updateSlotOccupancy()`: Mark slots occupied/free.
     - `storeTicketPosition()`: In-memory ticket → slot mapping.

2. **Add Random/Mock Generators**:
   - Random bike numbers: Generate realistic license plates.
   - ANPR simulation: Mock license plate detection.
   - Realistic timings: Use actual Date for entry/exit.

3. **Promise-Based API Wrapper**:
   - All endpoints return `Promise<Result>` to simulate async backend.
   - Add optional delays (`setTimeout`) for realistic API latency.
   - Include error handling (try-catch, fallback responses).

### Phase 3: Frontend Integration (3–3.5 giờ)

1. **Screen 1 (Tổng Quan)**:
   - On mount: Call `parkingAPI.getParkingStatus()`.
   - Display 6 floors + occupancy bars.
   - Click floor → trigger API, navigate to Screen 3.

2. **Screen 2 (Nhận Thẻ)**:
   - Mock ANPR data (random bike number).
   - Click "Đỗ xe" → call `parkingAPI.issueTick()`.
   - Show ticket ID + entry time.

3. **Screen 3 (Sơ Đồ Tầng)**:
   - Display grid of slots (4 areas × 6 slots).
   - Click slot → highlight + call `parkingAPI.saveSlot()`.
   - Show success/failure message.

4. **Screen 4 (Tra Cứu)**:
   - Input or mock tap ticket → call `parkingAPI.checkPosition()`.
   - Display floor/area/slot or "Không tìm thấy" message.

5. **Screen 5 (Thanh Toán)**:
   - Step 1: Mock card tap → load transaction.
   - Step 2: Call `parkingAPI.calculateFee()` → show amount.
   - Step 3: Select payment method (QR/Card) → call `parkingAPI.processPayment()`.
   - Show success confirmation or error.

### Phase 4: End-to-End Testing & Refinement (1.5–2 giờ)

1. **Simulate Full 11-Step Flow**:
   - Entry: Issue ticket → Choose floor → Save slot.
   - Retrieve: Check position.
   - Exit: Calculate fee → Pay → Confirm.
   - Verify state is consistent at each step.

2. **Verify In-Memory Only**:
   - Check DevTools: No localStorage/sessionStorage keys.
   - Reload page → Data resets (expected).
   - All data lives in React state + service module scope.

3. **Error Handling**:
   - Test invalid ticket IDs → API returns error.
   - Test slot already occupied → API returns error or blocks.
   - Test payment with insufficient amount → API rejects.

4. **Polish**:
   - Add loading states (spinners, disabled buttons) during API calls.
   - Verify error messages are user-friendly.
   - Test on different screen sizes.

## Success Criteria

- ✓ **Backend-Frontend Separation:** Service logic in `ParkingService.ts`, UI logic in React components.
- ✓ **API Contract Fulfilled:** All 6 mock API endpoints respond correctly.
- ✓ **11-Step Flow Complete:** Entry (1–6) → Retrieve (7) → Exit+Payment (8–11) works seamlessly.
- ✓ **State Consistency:** Ticket ID, slot position, fee persist across screens.
- ✓ **In-Memory Only:** No localStorage, no database, data lost on reload (expected).
- ✓ **Error Handling:** Invalid tickets, occupied slots, payment failures handled gracefully.
- ✓ **No Runtime Errors:** Console clean, all Promises resolved correctly.
- ✓ **Loading States:** API calls show spinners; buttons disabled during requests.
- ✓ **Realistic Mock Data:** Bike numbers, fees, timestamps appear authentic.

## Milestones

| Phase                  | Đầu Vào                      | Đầu Ra                                            | Thời Gian  |
| ---------------------- | ---------------------------- | ------------------------------------------------- | ---------- |
| Backend Design         | Luồng 11 bước, Pricing Rules | Type Interfaces, API Contract                     | 1.5–2h     |
| Backend Implementation | API Contract                 | ParkingService.ts, Mock Data Store                | 2–2.5h     |
| Frontend Integration   | Wireframe, ParkingService    | 5 Screens đầy đủ với API calls                    | 3–3.5h     |
| Testing & Polish       | Full Prototype               | Verified End-to-End Flow, Error Handling          | 1.5–2h     |
| **Total**              | —                            | **Interactive Parking System (Backend-Frontend)** | **~8–11h** |
