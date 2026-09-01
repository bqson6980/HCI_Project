# Software Builder - Simulation System Parking Management

## Purpose
Xây dựng phần mềm mô phỏng toàn bộ quy trình gửi và lấy xe cho hệ thống quản lý bãi xe thông minh, bao gồm cả Backend API mô phỏng và Frontend UI tương tác đầy đủ.

## Use this skill when
- Người dùng yêu cầu phát triển phần mềm mô phỏng (simulation) toàn bộ quy trình gửi/lấy xe.
- Cần xây dựng hệ thống quản lý bãi xe với backend logic và frontend UI tích hợp.
- Dự án đang ở giai đoạn xây dựng phần mềm hoàn chỉnh (full-stack) phục vụ nghiên cứu HCI.
- Cần chuẩn bị dữ liệu mock, xử lý trạng thái, và mô phỏng các tương tác thực tế.

## Required inputs
- Tài liệu persona trong `data/persona/` (đặc biệt là Nguyễn Văn Duy).
- Bản vẽ phác thảo hoặc prototype trong `data/ui_design` và `output/prototype`.
- Quy tắc HCI từ `rules/hci.md` và các quy chuẩn thiết kế khác.

## Expected outputs
Thư mục `code/` sẽ chứa:
- **Backend (Express.js / Node.js mô phỏng):** 
  - API endpoints quản lý tầng bãi, xe gửi, vị trí đỗ, thanh toán.
  - Mock database hoặc in-memory store quản lý dữ liệu bãi xe.
  - Xử lý trạng thái: Xe vào/ra, thanh toán, tra cứu vị trí.

- **Frontend (React + TypeScript):**
  - Tất cả các screen mô tả trong persona (Overview tầng, Nhận thẻ, Chọn tầng, Tra cứu vị trí, Thanh toán).
  - Tương tác mượt mà, feedback tức thì khi người dùng thao tác.
  - Kết nối frontend-backend qua API calls.

- **Documentation:**
  - `SOFTWARE_SPEC.md`: Mô tả đầy đủ kiến trúc hệ thống, API endpoints, flow logic.
  - `README.md`: Hướng dẫn chạy/phát triển phần mềm.

## High-level Workflow
1. **Phân tích yêu cầu:**
   - Đọc persona Nguyễn Văn Duy để nắm bắt user flow chi tiết.
   - Kiểm tra prototype hiện tại để xác định cấu trúc UI.
   - Suy luận logic backend cần thiết để mô phỏng hệ thống.

2. **Thiết kế kiến trúc:**
   - Định nghĩa API endpoints (GET/POST).
   - Thiết kế data models: Parking floor, Parking slot, Car, Ticket, Payment.
   - Tính toán trạng thái: Slot availability, Car location, Payment status.

3. **Phát triển Backend:**
   - Xây dựng Express server mô phỏng.
   - Tạo mock database (in-memory hoặc JSON file).
   - Implement logic gửi xe, lấy xe, thanh toán.

4. **Phát triển Frontend:**
   - Xây dựng React components tái sử dụng (Button, Card, FloorMap, etc.).
   - Implement user flows từ persona: Gửi xe → Nhận thẻ → Lấy xe → Thanh toán.
   - Kết nối API calls tới backend.
   - Thêm animations, transitions để tạo trải nghiệm mượt mà.

5. **Kiểm tra & Cải tiến:**
   - Tự kiểm tra toàn bộ flow gửi/lấy xe.
   - Đối chiếu với persona để đảm bảo meet user expectations.
   - Tối ưu hóa UX: Giảm số bước nhấn, nâng cao clarity, phản hồi tức thì.

## Key Personas & User Flows
- **Primary: Nguyễn Văn Duy** (28 tuổi, Nhân viên văn phòng)
  - Goal: Gửi xe trong dưới 3 phút, không lạc xe, thanh toán nhanh.
  - Main Frustrations: Không biết còn chỗ, quên vị trí xe, xếp hàng chờ.
  - Required Features: Xem tầng trống realtime, tra cứu vị trí xe qua thẻ, thanh toán QR/thẻ.

## Data Models & Business Logic
- **Floor:** Tầng hầm (B1-B6), số chỗ tổng, số chỗ trống, trạng thái (AVAILABLE/NEARLY_FULL/FULL).
- **Slot:** Ô đỗ (A1-D20 theo khu), status (EMPTY/OCCUPIED/RESERVED).
- **Car:** Xe gửi (biển số, vào lúc, ra lúc).
- **Ticket:** Thẻ gửi (mã thẻ, xe liên kết, vị trí đỗ, phí, thời hạn).
- **Payment:** Thanh toán (mã ticket, số tiền, phương thức POS/QR, status).

## Technical Stack
- **Frontend:** React 18+ / TypeScript / Tailwind CSS / Vite.
- **Backend:** Node.js / Express / TypeScript / Cors.
- **State Management:** React Hooks (useState, useContext).
- **API Communication:** Fetch API / Axios.
- **Data Storage:** In-memory (Map/Object) hoặc JSON file (mock DB).

## Implementation Phases
1. **Phase 1 - Backend Setup:** Tạo Express server, define API structure, mock database.
2. **Phase 2 - Core Logic:** Implement floor availability, ticket generation, payment logic.
3. **Phase 3 - Frontend Setup:** Initialize React project, component structure, routing.
4. **Phase 4 - UI Components:** Xây dựng atomic components (Button, Card, FloorMap).
5. **Phase 5 - Feature Integration:** Kết nối API, implement user flows (gửi/lấy xe).
6. **Phase 6 - Polish & Testing:** Animations, micro-interactions, error handling, UX optimization.

## Success Criteria
- ✅ Toàn bộ quy trình gửi xe (xem tầng → nhận thẻ → đỗ xe) hoạt động.
- ✅ Toàn bộ quy trình lấy xe (quẹt thẻ → xem vị trí → thanh toán) hoạt động.
- ✅ Frontend trực quan, ít thao tác (meet Nguyễn Văn Duy's expectations).
- ✅ API endpoints mô phỏng chính xác logic quản lý bãi xe.
- ✅ Code clean, documented, easy to extend.
- ✅ Không có lỗi syntax, runtime, hoặc logic.
