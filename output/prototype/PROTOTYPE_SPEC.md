# 📋 Wireframe & Prototype Spec - Parking System

## Scope
Tài liệu mô tả chi tiết giao diện và luồng tương tác của Web Prototype Hệ thống Kiosk Gửi xe Thông minh, dựa trên các bản vẽ phác thảo (sketch) trong thư mục `data/ui_design`.

Nguồn đối chiếu chính gốc (Ground Truth):
- `available_slot_overview.png`
- `receive_card.png`
- `available_slot_basementdetail.png`
- `check_position.png`
- `payment.png`

---

## Screen 1 — Tổng quan chỗ trống gửi xe (Overview Screen)
- **Mục tiêu:** Hiển thị công suất và chỗ trống toàn bộ các tầng hầm từ B1 đến B6 giúp người lái xe nắm bắt nhanh trạng thái bãi.
- **Layout & Cấu trúc:**
  - Panel tổng hợp 3 chỉ số cốt lõi: Tổng sức chứa, Đã sử dụng, Còn trống toàn bãi.
  - Danh sách 6 tầng hầm (B1 - B6) sắp xếp theo hàng dọc liền mạch từ trên xuống dưới.
  - Mỗi dòng chứa: Mã tầng (`B1`-`B6`), Tên tầng, Loại xe (`Xe máy`), Số chỗ trống / tổng chỗ, Thanh phần trăm tiến trình và Nhãn trạng thái (`CÒN TRỐNG`, `GẦN ĐẦY`, `ĐẦY`).
  - Đã tối giản thông tin, loại bỏ các icon dư thừa giúp tối ưu hóa HCI cho Kiosk.

---

## Screen 2 — Nhận thẻ khi gửi xe vào bãi (Ticket Screen)
- **Mục tiêu:** Ghi nhận thông tin xe vào cổng và cấp thẻ gửi xe cho khách.
- **Layout & Cấu trúc:**
  - Cột trái: Feed giả lập Camera ANPR nhận diện biển số tự động (VD: `52-F1 888.88`), Thời gian vào cổng realtime.
  - Cột phải: Bảng biểu phí niêm yết theo khung giờ (0-4h, 4-12h, Qua đêm, Vé tháng).
  - Nút hành động chính (CTA): `PRESS TO RECEIVE CARD / NHẤN NÚT LẤY THẺ`.
  - Màn hình xác nhận nhận thẻ kèm mã thẻ được cấp (`#P-8821`).

---

## Screen 3 — Sơ đồ chi tiết tầng B2 (Floor Map Screen)
- **Mục tiêu:** Trực quan hóa sơ đồ phân khu chỗ trống chi tiết tại Tầng B2 theo bản vẽ sketch `available_slot_basementdetail.png`.
- **Layout & Cấu trúc:**
  - Header tiêu đề nổi bật: **TẦNG B2**.
  - Lưới 2x2 gồm 4 phân khu chính: **Khu A**, **Khu B**, **Khu C**, **Khu D**.
  - Trong mỗi phân khu là lưới 2x3 gồm 6 Block (sức chứa 20 xe/block):
    - **Khối màu đỏ (`0/20`):** Cụm đã đầy chỗ đỗ.
    - **Khối màu xanh (`5/20`, `2/20`, ...):** Cụm còn chỗ trống.
  - Phía dưới: Mũi tên hướng cổng vào (⬆) + Ghim định vị vị trí (📍) nhãn **`You are here! (Vị trí của bạn)`**.

---

## Screen 4 — Tra cứu vị trí xe đỗ bằng Thẻ (Check-Position Screen)
- **Mục tiêu:** Giúp người gửi xe tìm lại vị trí xe đỗ khi quay lại bãi bằng cách quẹt thẻ gửi xe tại Kiosk.
- **Layout & Cấu trúc:**
  - Trạng thái ban đầu: Hướng dẫn quẹt thẻ gửi xe.
  - Sau khi quẹt thẻ `#P-8821`: Hiển thị bảng kết quả định vị chính xác vị trí đỗ: **TẦNG B2 - KHU C - Cụm VỊ TRÍ C4**.
  - Sơ đồ khu C được làm nổi bật với biểu tượng xe `🚗` và dải chỉ dẫn rõ ràng.

---

## Screen 5 — Thanh toán & Rời bãi xe (Payment Screen)
- **Mục tiêu:** Luồng thanh toán siêu tốc 1 bước tại Kiosk cổng ra, tự động kích hoạt mở Barie cho xe rời bãi.
- **Layout & Cấu trúc:**
  - Quy trình tối giản 3 bước rõ ràng trên thanh chỉ báo: `1. Quẹt thẻ gửi xe` ➔ `2. Thanh toán (QR / Thẻ POS)` ➔ `3. Mở Barie rời bãi`.
  - Màn hình thanh toán tập trung (Single Unified Screen):
    - Cột trái: Thông tin phiếu gửi xe (Biển số, vị trí đỗ, thời gian vào/ra, thời lượng) & Số tiền cần trả (**4.000 VNĐ**).
    - Cột phải: Mã QR Code thanh toán (MoMo/VNPay/Banking) hiển thị sẵn ngay lập tức, kèm thẻ chuyển nhanh sang `💳 Chạm thẻ POS`.
  - Xác nhận hoàn tất thanh toán ➔ Cổng Barie mở tự động với thông báo an toàn.

---

## Validation Checklist & Quy chuẩn HCI
- Đã phản ánh chính xác 100% logic và cấu trúc từ các bản vẽ sketch trong `data/ui_design`.
- Áp dụng triệt để nguyên tắc thiết kế HCI cho Kiosk: Giảm bớt số bước nhấn, nâng cao độ tương phản chữ, thông tin rõ ràng dễ đọc từ xa.
- Đã kiểm tra không còn lỗi biên dịch TypeScript (`npx tsc --noEmit` pass code 0).
