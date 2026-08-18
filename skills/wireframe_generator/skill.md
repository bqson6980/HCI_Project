# Wireframe Generator Skill

## Purpose
Hướng dẫn AI phân tích bản hand sketch và thiết lập cấu trúc Wireframe (Low-fidelity) chuẩn xác, logic và bám sát nguyên lý thiết kế giao diện.

## Domain Knowledge
**Low-fidelity Wireframe Principles:** Tập trung hoàn toàn vào cấu trúc (structure), phân cấp thông tin (information hierarchy) và khoảng cách (spacing); không dùng màu sắc phức tạp hay hiệu ứng đồ họa.
**User-Centered Design (UCD) & Usability:** Đảm bảo vị trí các thành phần tuân theo thói quen quét mắt (F-pattern, Z-pattern) và các nguyên lý HCI/ISO 9241 cơ bản.
**Layout Grids & Alignment:** Sắp xếp các khối theo hệ thống lưới rõ ràng (Grid system), căn chỉnh lề (alignment) và khoảng cách phân tầng hợp lý.

## Reasoning & Inference Strategy
1. **Phân tích bản phác thảo (`data/ui_design`):**
   - Xác định kích thước màn hình mục tiêu (Touchscreen).
   - Nhận diện các vùng chính: Header, Navigation bar, Main content areas, Sidebar, Modal/Dialog, Footer.
2. **Suy luận thành phần bị khuyết:**
   - Chỉ suy luận thêm các thành phần phụ (như nút Back, icon Close, breadcrumbs) nếu bản sketch để sót nhưng thực tế tương tác bắt buộc phải có.
   - Không tự ý thêm bớt các tính năng hoặc chức năng lớn không xuất hiện trong bản phác thảo.
3. **Phân rã Component (Deconstruction):**
   - Nhóm các phần tử liên quan thành từng khối cụ thể (ví dụ: Card, Form field, Data table, Action button group) để chuẩn bị đầu vào cho bước code Prototype tiếp theo.

## Validation Rules
- **Độ phủ thông tin:** Mọi phần tử có trong bản sketch ở `data/ui_design` đều phải được phản ánh đầy đủ trong Wireframe.
- **Tính tối giản:** Không đưa màu sắc trang trí, typography phức tạp hay ảnh minh họa thật vào wireframe (dùng placeholder box thay thế).
- **Tính nhất quán:**
  - Kiểm tra tính logic giữa các khối nội dung và hành động của người dùng.
  - Đảm bảo tính cân đối và tỷ lệ kích thước giữa các khu vực.

## Failure & Clarification Handling
- Nếu bản sketch tại `data/ui_design` bị mờ, chữ viết tay không rõ hoặc bố cục mơ hồ: Liệt kê rõ các điểm không chắc chắn và đặt câu hỏi cho người dùng trước khi tạo bản hoàn chỉnh.
- Nêu rõ các giả định (assumptions) đã sử dụng trong quá trình phân tích layout.