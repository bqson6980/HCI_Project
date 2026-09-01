## Plan.md — Quy tắc xử lý Script → Storyboard

### 1. Input / Output

- `input/script.md` là nguồn dữ liệu gốc, **không sửa** trừ khi user yêu cầu rõ ràng.
- Script sau khi chuẩn hóa phải xuất ra file riêng: `output/storyboard.md`.
- `templates/storyboard.md` dùng làm cấu trúc mẫu cho storyboard output.

### 2. Phân loại nội dung rõ ràng

Phân biệt 3 loại thông tin:
- **a. Nội dung script gốc** — trích xuất nguyên văn từ `input/script.md`.
- **b. Storyboard đã chuẩn hóa** — nội dung được format theo template, xuất ra `output/storyboard.md`.
- **c. Thông tin cần user xác nhận** — đánh dấu `[NEEDS CONFIRMATION]`.

### 3. Timeline

- Nếu user cung cấp timeline milestones, **tuân thủ tuyệt đối**.
- Chỉ yêu cầu user xác nhận khi có mâu thuẫn hoặc thiếu thông tin quan trọng.
- **Không tự suy ra** timestamp cụ thể nếu script không cung cấp hoặc không đủ cơ sở.

### 4. Frame count

- Nếu script đã có số frame cụ thể → **giữ nguyên số frame**.
- Chỉ đề xuất thêm/bớt frame khi user yêu cầu hoặc khi phát hiện lỗi cấu trúc nghiêm trọng (phải báo cho user).
- **Không tự ý thay đổi** số lượng frame.

### 5. Workflow

1. **Kiểm tra script** — Xem `input/script.md` đã có frame structure (`### Khung N`) hay chưa.
2. **Validate & Normalize**:
   - Nếu script **đã có frame structure** → ưu tiên validate và normalize theo template, **không chia lại frame**.
   - Nếu script **chưa có frame structure** → phân tích và chia frame theo logic, sau đó báo user xác nhận.
3. **Kiểm tra template** — Nếu `templates/storyboard.md` chưa tồn tại → **báo cho user**, KHÔNG tự tạo template trong bước này.
4. **Xuất output** — Ghi kết quả chuẩn hóa vào `output/storyboard.md`.

### 6. Failure Handling

- Nếu có thông tin quan trọng chưa rõ → đánh dấu `[NEEDS CONFIRMATION]`.
- **Không tự bịa thông tin** để hoàn thành frame.

### 7. Checks trước khi xuất

- Đúng số frame so với script gốc.
- Timeline nhất quán, không mâu thuẫn.
- Mỗi frame có đầy đủ: số khung, loại shot, mô tả hình ảnh, chú thích.
- Không có nội dung bịa đặt, mọi thứ phải có nguồn gốc từ script.
