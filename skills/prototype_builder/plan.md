# Interactive Prototype Builder

## Purpose
Nhận cấu trúc wireframe và bản phác thảo giao diện để xây dựng một bản Interactive Prototype hoàn chỉnh, chạy được bằng ReactJS, có tính tương tác cao và mô phỏng sát trải nghiệm sản phẩm thực tế.

## Use this skill when
- Bước tạo Wireframe đã hoàn thành và được người dùng xác nhận.
- Cần tạo mã nguồn ReactJS có thể chạy trực tiếp, hỗ trợ click, nhập liệu, chuyển trạng thái hoặc mô phỏng luồng thao tác người dùng.
- Cần kiểm thử trải nghiệm người dùng (Usability/UX) trên giao diện động trước khi tích hợp backend.

## Required inputs
Một hoặc nhiều thông tin sau:
- Tài liệu cấu trúc Wireframe  `output/wireframe` - kết quả từ skill `wireframe-generator`.
- Bản phác thảo thiết kế tại `data/ui_design`.
- Yêu cầu về Tech Stack (ReactJS, Tailwind CSS/CSS modules, thư viện icon,...).
- Kịch bản tương tác (User Flow) cần mô phỏng (ví dụ: mở modal, submit form, filter dữ liệu).

## Output
- Đường dẫn `output/prototype`
- Mã nguồn ReactJS hoàn chỉnh (Components, Pages, Mock Data, State Management) có thể biên dịch và chạy trên trình duyệt.
- Hướng dẫn khởi chạy hoặc xem trước prototype.

## Workflow
1. Đọc tài liệu wireframe đã được duyệt và đối chiếu với bản sketch tại `data/ui_design`.
2. Phân rã giao diện thành cây component ReactJS có tính tái sử dụng cao.
3. Thiết lập hệ thống styling hiện đại (phân cấp thị giác, màu sắc, typography, responsive).
4. Cài đặt logic trạng thái (React state/hooks) và mock data để xử lý các hành vi tương tác.
5. Kiểm tra, tự đối chiếu giao diện dựng được với bản vẽ gốc để đảm bảo tính nhất quán.
6. Báo cáo kết quả và nêu các điểm cần cải thiện/xin ý kiến người dùng nếu có.