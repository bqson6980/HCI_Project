# storyboard md.md

## Project

Project này dùng để xử lý scenario/script thành storyboard có cấu trúc,
sau đó có thể dùng storyboard làm đầu vào cho image generation ở giai đoạn sau.

## Project Structure

Các tài nguyên chính:

* `input/script.md`
  * Source of truth của scenario/script.

* `.opencode/skills/storyboard/Plan.md`
  * Mô tả khi nào sử dụng skill, input, output và workflow.

* `.opencode/skills/storyboard/SKILL.md`
  * Mô tả domain knowledge, reasoning, rules, validation và failure handling.

* `templates/storyboard.md`
  * Cấu trúc trình bày storyboard output.

* `output/storyboard.md`
  * File storyboard đã được chuẩn hóa.

## General Rules

1. `input/script.md` là source of truth.
2. Không sửa `input/script.md` trừ khi user yêu cầu rõ ràng.
3. Không tự tạo thông tin quan trọng không có trong source.
4. Nếu thông tin quan trọng chưa rõ, sử dụng `[NEEDS CONFIRMATION]`.
5. Không tạo hình ảnh trong storyboard workflow hiện tại.
6. Không tự tạo hoặc thay đổi template.
7. Không tự ý thêm hoặc bớt frame nếu script đã có số frame cụ thể.
8. Không tự tạo timestamp exact nếu source không cung cấp.
9. Nếu phát hiện mâu thuẫn quan trọng, phải báo user thay vì tự quyết định.

## Skill Routing

Khi user yêu cầu một task liên quan đến storyboard:

1. Đọc `.opencode/skills/storyboard/Plan.md`.
2. Xác định task có thuộc phạm vi của Storyboard Skill hay không.
3. Nếu thuộc phạm vi, sử dụng Storyboard Skill.
4. Khi cần thực hiện reasoning hoặc validation chi tiết, sử dụng:
   `.opencode/skills/storyboard/SKILL.md`.
5. Sử dụng `templates/storyboard.md` khi tạo storyboard output.

Không yêu cầu user phải nhắc Agent đọc các file trên trong mỗi prompt.

## Workflow

### Phase 1 — Read Input

1. Đọc `input/script.md`.
2. Xác định script đã có frame structure hay chưa.
3. Nếu script chưa tồn tại hoặc rỗng:
   * Không tự tạo nội dung.
   * Yêu cầu user cung cấp script.

### Phase 2 — Determine Task

Xác định user đang yêu cầu một trong các loại task:

* Analyze storyboard
* Validate storyboard
* Normalize storyboard
* Revise storyboard
* Generate storyboard
* Review existing storyboard

Nếu task không thuộc Storyboard Skill:
* Không tự gọi Storyboard Skill.
* Xử lý theo phạm vi task tương ứng hoặc yêu cầu user làm rõ.

### Phase 3 — Load Storyboard Skill

Nếu task thuộc storyboard:

1. Đọc `Plan.md`.
2. Đọc `SKILL.md`.
3. Áp dụng reasoning và validation trong `SKILL.md`.
4. Không tự viết lại các rules của Skill trong AGENTS.md.

### Phase 4 — Validate Before Output

Trước khi xuất storyboard:

1. Kiểm tra source traceability.
2. Kiểm tra frame count.
3. Kiểm tra timeline.
4. Kiểm tra continuity.
5. Kiểm tra transitions.
6. Kiểm tra shot type.
7. Kiểm tra các `[NEEDS CONFIRMATION]`.

Nếu phát hiện vấn đề:
* Minor issue có thể được ghi chú nếu không làm thay đổi ý nghĩa source.
* Major issue phải đánh dấu `[NEEDS CONFIRMATION]`.
* Không tự sửa thông tin quan trọng.

### Phase 5 — Generate Output

Khi storyboard đủ điều kiện để xuất:

1. Sử dụng `templates/storyboard.md`.
2. Tạo hoặc cập nhật: `output/storyboard.md`
3. Không ghi đè `input/script.md`.

Output phải có cùng cấu trúc với template.

### Phase 6 — Final Verification

Trước khi trả kết quả cho user:

* Đảm bảo output tồn tại đúng vị trí.
* Đảm bảo output tuân theo template.
* Đảm bảo không có thông tin bịa đặt.
* Đảm bảo các `[NEEDS CONFIRMATION]` được liệt kê rõ ràng.
* Đảm bảo input không bị thay đổi ngoài yêu cầu của user.

## User Interaction

Nếu task có thông tin quan trọng chưa rõ:
1. Không tự đoán.
2. Xác định frame hoặc phần bị ảnh hưởng.
3. Giải thích ngắn gọn vấn đề.
4. Đưa ra lựa chọn hoặc câu hỏi cụ thể để user xác nhận.

Nếu user yêu cầu sửa storyboard:
* Chỉ sửa nội dung mà user yêu cầu hoặc nội dung phụ thuộc trực tiếp vào thay đổi đó.
* Sau khi sửa phải chạy lại validation liên quan.

Nếu user chỉ yêu cầu phân tích:
* Không tự sửa file.
* Chỉ trả về kết quả phân tích.

Nếu user yêu cầu tạo hoặc cập nhật storyboard:
* Được phép tạo/cập nhật `output/storyboard.md`.
* Không sửa `input/script.md` trừ khi user yêu cầu rõ ràng.

## Separation of Responsibilities

**AGENTS.md:** Điều phối workflow.

**Plan.md:** Xác định skill dùng khi nào, input/output và workflow của skill.

**SKILL.md:** Xác định cách LLM suy luận, validation và xử lý lỗi.

**templates/storyboard.md:** Xác định cấu trúc output.

**input/script.md:** Source of truth.

**output/storyboard.md:** Kết quả đã xử lý.

> Không đưa reasoning chi tiết hoặc domain knowledge vào AGENTS.md nếu nội dung đó đã thuộc SKILL.md.
