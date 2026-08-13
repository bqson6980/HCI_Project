# AGENTS.md — Quy tắc & Điều phối AI cho Dự án HCI

## 1. Tổng quan Dự án (Project Overview)
Dự án này phục vụ môn Học Interactive Design / HCI (Human-Computer Interaction).
Mục tiêu là nghiên cứu trải nghiệm người dùng, đề xuất cải tiến và xây dựng bản thiết kế/prototype xem trước cho hệ thống tương tác.

---

## 2. Cấu trúc Dự án & Quy tắc Quản lý Tài nguyên

AI phải tuyệt đối tuân thủ phân định thư mục sau:

- **`data/` (Ground Truth - Tư liệu gốc):**
  - Chứa thông tin và tư liệu đầu vào do người dùng cung cấp (phác thảo tay, kịch bản, ghi chú phỏng vấn, khảo sát,...).
  - **Quy tắc:** AI chỉ dùng dữ liệu trong `data/` làm nguồn tri thức chính gốc (Ground Truth). Tuyệt đối KHÔNG tự sáng tác hay bịa đặt các thông tin trái ngược với `data/` (ngăn ngừa hallucination).

- **`code/` (Web Prototype / Interactive Preview):**
  - Chứa toàn bộ mã nguồn frontend phục vụ việc dựng giao diện xem trước cải tiến HCI.
  - **Quy tắc:** Khi phát triển hoặc chỉnh sửa giao diện, mọi file code thực thi phải nằm trong thư mục này.

- **`output/` (Thành phẩm Export):**
  - Chứa các file kết quả cuối cùng do AI hoặc tool sinh ra (file ảnh, PDF báo cáo,...).

- **`skills/` & `rules/`:**
  - `skills/`: Chứa các quy trình xử lý công việc cụ thể của AI.
  - `rules/`: Chứa quy chuẩn thiết kế, nguyên tắc HCI và phong cách làm việc.

- **`templates/` & `tools/`:**
  - `templates/`: Chứa các khung mẫu giao diện hoặc báo cáo.
  - `tools/`: Chứa các script bổ trợ tự động hóa.

- **`.opencode/`:**
  - Thư mục cấu hình local và chứa các Custom Tools cho OpenCode.

---

## 3. Quy trình Làm việc (Workflow Standard)

Khi được giao nhiệm vụ, AI tuân theo quy trình từng bước sau:

### Tác vụ 1: Chuẩn hóa & Sinh tài liệu HCI (Persona, Scenario, User Flow,...)
1. Kiểm tra tài nguyên gốc trong thư mục `data/`.
2. Nạp quy trình tương ứng trong `skills/` và quy tắc trong `rules/`.
3. Đọc mẫu layout tại `templates/`.
4. Tổng hợp dữ liệu thành định dạng chuẩn.
5. Nếu cần xuất file ảnh/PDF: Gọi công cụ tự động (script tại `tools/` hoặc Custom Tool tại `.opencode/tools/`) để lưu kết quả vào `output/`.

### Tác vụ 2: Dựng Giao diện Xem trước (Web Prototype)
1. Đọc tư liệu, kịch bản hoặc bản vẽ phác thảo trong `data/`.
2. Sinh hoặc cập nhật mã nguồn (HTML/CSS/JS) trực tiếp vào thư mục `code/`.
3. Sử dụng vòng lặp kiểm tra (**Gather Context ➔ Take Action ➔ Verify Results**): So sánh kết quả hiển thị với thiết kế ban đầu trong `data/` và tinh chỉnh cho đến khi đạt yêu cầu.

---

## 4. Quy tắc Ứng xử & Giao tiếp của AI

- **Ngôn ngữ:** Ưu tiên phản hồi bằng Tiếng Việt rõ ràng, ngắn gọn, chuyên nghiệp.
- **Sự trung thực:** Nếu tư liệu trong `data/` chưa đủ để thực hiện yêu cầu, AI phải nêu rõ điểm còn thiếu và xin thêm thông tin thay vì tự ý giả định.
- **Xác nhận trước khi đổi lớn:** Trước khi thay đổi cấu trúc file hoặc sửa đổi lớn trong `code/`, AI cần giải thích ngắn gọn hướng xử lý.