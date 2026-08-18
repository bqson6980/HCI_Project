# Interactive Prototype Builder Skill

## Purpose
Hướng dẫn AI phân tích cấu trúc wireframe và thiết kế phác thảo để sinh mã nguồn ReactJS chất lượng cao, mô phỏng đầy đủ trạng thái tương tác của giao diện người dùng.

## Domain Knowledge
- **Modern UI/UX Principles:** Áp dụng thiết kế lấy người dùng làm trung tâm (UCD), đảm bảo độ tương phản (contrast), khoảng cách (spacing), kích thước vùng bấm (touch target) và tính phản hồi tức thì (feedback states: hover, active, focus, disabled).
- **ReactJS Best Practices:** Tổ chức component dạng module, phân tách rõ giữa UI components và container/page logic, sử dụng React Hooks (`useState`, `useEffect`, `useMemo`) hợp lý.
- **Micro-interactions:** Tích hợp chuyển động/hiệu ứng mượt mà (transitions, animation) giúp trải nghiệm chân thực như ứng dụng thực tế.

## Reasoning & Implementation Strategy
1. **Kiểm tra đầu vào:**
   - Đọc kỹ wireframe và thư mục `data/ui_design` để nắm bắt trọn vẹn bố cục và luồng chức năng.
2. **Thiết kế kiến trúc Component:**
   - Chia nhỏ giao diện: Atomic components (Button, Input, Badge) $\rightarrow$ Composite components (Card, Form, Navbar) $\rightarrow$ Layout/Pages.
   - Tránh viết toàn bộ code vào một file duy nhất; phân tách file rõ ràng để dễ mở rộng.
3. **Mô phỏng dữ liệu & Trạng thái tương tác:**
   - Tạo bộ mock data chân thực thay vì dùng text giả lặp đi lặp lại vô nghĩa.
   - Xử lý các tương tác cơ bản: mở/đóng popup/modal, lọc/tìm kiếm danh sách, validate form nhập liệu, tab switching.
4. **Vòng lặp tự kiểm tra (Self-Verification Loop):**
   - Tự rà soát lại mã nguồn đã sinh để đảm bảo không có lỗi cú pháp hoặc import thiếu.
   - So sánh trực quan các thành phần UI tạo ra với layout yêu cầu.

## Validation Rules
- **Độ chính xác bố cục:** Giao diện ReactJS dựng ra phải tương đồng về cấu trúc và tỷ lệ với bản wireframe và sketch tại `data/ui_design`.
- **Khả năng thực thi (Executable):** Code sinh ra phải hợp lệ, chạy được ngay mà không gặp lỗi runtime hoặc compile error.
- **Xử lý trạng thái đầy đủ:** Mọi phần tử tương tác (nút bấm, dropdown, input) đều phải có phản hồi khi người dùng tương tác.
- **Tự động sửa lỗi:** Nếu trong quá trình đối chiếu phát hiện bất kỳ sự thiếu sót hoặc sai lệch nào so với thiết kế, phải lập tức viết lại/sửa đổi code cho chuẩn xác.

## Failure & Improvement Handling
- **Hỏi ý kiến User:** Nếu phát hiện các điểm thiết kế chưa rõ ràng trong wireframe hoặc có ý tưởng tối ưu UX tốt hơn bản gốc, hãy giải thích lý do và chủ động hỏi ý kiến người dùng trước khi áp dụng thay đổi lớn.
- Nêu rõ các giả định về logic tương tác hoặc mock data đã tạo trong báo cáo phản hồi.