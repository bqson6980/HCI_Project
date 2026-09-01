# 🚗 Hệ Thống Quản Lý & Kiosk Gửi Xe Thông Minh (Parking Kiosk HCI System)

> **Dự án môn học:** Tương tác Người - Máy (Human-Computer Interaction - CSC12106 / Interactive Design)  
> **Mục tiêu:** Nghiên cứu trải nghiệm người dùng bãi đỗ xe đa tầng, giải quyết bài toán tìm chỗ trống, ghi nhớ vị trí xe và thanh toán nhanh không tiền mặt thông qua hệ thống Kiosk tương tác trực quan.

---

## 📌 Tổng Quan Cấu Trúc Dự Án

```text
HCI_Project/
├── README.md                  # Hướng dẫn tổng quan & chỉ dẫn vận hành toàn bộ dự án
├── AGENTS.md                  # Quy chuẩn điều phối & nguyên tắc làm việc của AI Agent
├── CHỈDẪN_CHẠY_MỚI.md         # Sổ tay hướng dẫn khởi chạy nhanh cho giảng viên/người dùng
│
├── code/                      # [SẢN PHẨM HOÀN CHỈNH] Ứng dụng Full-stack hoàn chỉnh
│   ├── backend/               # REST API Server (Node.js/Express, Port 5000)
│   └── frontend/              # Web Application tương tác (React + Vite + Tailwind, Port 3000)
│
├── output/                    # [THÀNH PHẨM XUẤT RA TỪ QUY TRÌNH THIẾT KẾ]
│   ├── prototype/             # Interactive Prototype độc lập (React + Vite, Port 5173)
│   │   ├── res_img/           # Bộ 10 ảnh chụp giao diện Prototype độ nét cao
│   │   └── capture_screens.mjs# Script tự động chụp màn hình toàn bộ prototype
│   ├── wireframe/             # Low-fidelity Wireframe mô phỏng bố cục thô
│   ├── storyboard/            # Chuỗi 16 khung ảnh Storyboard (frame_01.png -> frame_16.png)
│   ├── persona/               # Hồ sơ chân dung người dùng (Persona Nguyễn Văn Duy)
│   └── value-prop/            # Biểu đồ giá trị & định vị giải pháp
│
├── data/                      # [GROUND TRUTH] Tư liệu gốc đầu vào
│   ├── persona/               # Tài liệu nghiên cứu nhân khẩu học & pain points
│   ├── storyboard/            # Kịch bản 16 khung (script.md)
│   └── ui_design/             # Các bản phác thảo tay (hand sketches)
│
├── rules/                     # Bộ quy chuẩn thiết kế HCI, phong cách & chất lượng
├── skills/                    # Bộ quy trình tác nghiệp tự động hóa
└── templates/                 # Các khung mẫu giao diện & báo cáo
```

---

## 🚀 Hướng Dẫn Khởi Chạy Nhanh (Quick Start)

### 1. Chạy Sản Phẩm Phần Mềm Hoàn Chỉnh (Full-stack Product)

Mở 2 cửa sổ Terminal:

#### Terminal 1 — Khởi động Backend API Server (Port 5000)
```bash
cd code/backend
npm install
npm run dev
# Server lắng nghe tại: http://localhost:5000
```

#### Terminal 2 — Khởi động Frontend Web Kiosk (Port 3000)
```bash
cd code/frontend
npm install
npm run dev
# Mở trình duyệt truy cập: http://localhost:3000
```

---

### 2. Chạy Bản Prototype Tương Tác (Interactive Prototype)

Mở Terminal:
```bash
cd output/prototype
npm install
npm run dev
# Mở trình duyệt truy cập: http://localhost:5173
```

---

### 3. Chạy Bản Wireframe Thô (Low-fidelity Wireframe)

Mở Terminal:
```bash
cd output/wireframe/source
npm install
npm run dev
```

---

### 4. Tự Động Chụp Lại Toàn Bộ Màn Hình Prototype (Screenshot Tool)

```bash
cd output/prototype
node capture_screens.mjs
# Toàn bộ 10 ảnh chất lượng cao sẽ tự động lưu vào output/prototype/res_img/
```

---

## 🌟 6 Màn Hình Nghiệp Vụ Chính Trong Hệ Thống

1. **Màn hình 1: Tổng quan sức chứa (Overview Screen)**
   - Hiển thị công suất thời gian thực 6 tầng hầm (B1 - B6).
   - Chỉ số trực quan: Tổng chỗ trống, Đã gửi, Tỷ lệ % lấp đầy và huy hiệu trạng thái (*CÒN TRỐNG / GẦN ĐẦY / ĐÃ ĐẦY*).

2. **Màn hình 2: Lấy thẻ vào cổng (Issue Ticket Screen)**
   - Trạng thái chờ quét xe ➔ Bấm nút lấy thẻ `PRESS TO RECEIVE CARD`.
   - **Popup chọn tầng:** Người dùng chủ động chọn tầng muốn đỗ (B1 - B6).
   - Camera AI ANPR tự động bắt biển số xe và cấp vé điện tử `#P-8821`.

3. **Màn hình 3: Sơ đồ chi tiết tầng (Detailed Floor Map)**
   - Trực quan hóa 4 phân khu (Khu A, B, C, D).
   - Quản lý theo **Block 20 xe** (`5/20`, `2/20`, `0/20`), màu xanh còn chỗ, màu đỏ hết chỗ, đồng nhất theo đúng chú thích (Legend).

4. **Màn hình 4: Lưu vị trí xe đỗ (Save Position Screen)**
   - Ràng buộc **1 xe chỉ lưu đúng 1 vị trí**.
   - Chọn Khu vực (A-B-C-D) ➔ Chọn Block còn trống ➔ Bấm `LƯU VỊ TRÍ BLOCK NÀY ✔`.
   - Sau khi lưu thành công, hệ thống khóa cố định vị trí và vô hiệu hóa nút bấm để đảm bảo tính toàn vẹn dữ liệu.

5. **Màn hình 5: Tra cứu vị trí & Chỉ đường thông minh (Check-Position & GPS Wayfinding)**
   - Quẹt thẻ tại Kiosk cửa ra ➔ Hệ thống định vị ngay vị trí xe đỗ.
   - **Đường dẫn thông minh (Smart Aisle Routing):** Dải ruy-băng đỏ 2 lớp kèm nét đứt trắng GPS chuyển động dòng chảy từ điểm xuất phát `🚶 BẮT ĐẦU / LỐI RA` đi qua các hành lang chính và cắm mũi tên chỉ thẳng vào Block xe đỗ.

6. **Màn hình 6: Luồng Thanh toán & Rời bãi xe (Payment & Exit)**
   - Quy trình 1 chạm: Quẹt thẻ ➔ Màn hình hiển thị chi tiết thời lượng & số tiền (4.000 VNĐ).
   - Hỗ trợ thanh toán tức thì qua **Mã QR Động** hoặc **Chạm thẻ ngân hàng POS**.
   - Bấm xác nhận ➔ Barie tự động nâng mở và hoàn tất lượt gửi xe.

---

## 📊 Bộ Tư Liệu Nghiên Cứu HCI Đính Kèm

- **Storyboard 16 Khung:** `output/storyboard/` (`frame_01.png` đến `frame_16.png`) bám sát kịch bản tại `data/storyboard/script.md`.
- **Persona Khách hàng:** `data/persona/persona_nguyen_van_duy.md` định nghĩa chân dung, mục tiêu và khó khăn của người dùng mục tiêu.
- **Bản vẽ phác thảo (Hand Sketches):** `data/ui_design/` gồm 5 bản vẽ gốc làm căn cứ thiết kế chuẩn mực.