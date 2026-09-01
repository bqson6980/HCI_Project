## SKILL.md — Storyboard Processing

---

### 1. Domain Knowledge

#### 1.1 Storyboard là gì

Storyboard là **chuỗi các frame (khung) được sắp xếp theo thứ tự thời gian**, mỗi frame mô tả một khoảnh khắc cụ thể trong story. Mỗi frame chứa: số thứ tự, thời gian (nếu có), loại shot, mô tả hình ảnh, và chú thích.

#### 1.2 Frame

Frame là **đơn vị nhỏ nhất** của storyboard. Một frame = một khoảnh khắc, một ý hình ảnh. Frame có thể chứa:
- Số khung / tên (nếu script đặt)
- Thời gian hoặc khoảng thời gian
- Loại shot (camera angle)
- Mô tả hình ảnh (visual description)
- Yếu tố nhấn mạnh (nếu có)
- Chú thích (dialogue, thought, caption)

#### 1.3 Visual Continuity (Tính liên tục hình ảnh)

Storyboard phải đảm bảo **tính liên tục** giữa các frame liền kề:
- **Temporal continuity**: Thời gian không nhảy ngược hoặc mâu thuẫn.
- **Spatial continuity**: Vị trí nhân vật / đối tượng di chuyển theo logic không gian.
- **Object continuity**: Thiết bị, đạo cụ xuất hiện hoặc biến mất phù hợp với ngữ cảnh hành động (xem chi tiết ở mục 2.5).
- **Character continuity**: Ngoại hình, trang phục, biểu cảm nhất quán (nếu script mô tả).

#### 1.4 Shot Type & Visual Purpose

| Shot type | Visual purpose |
|-----------|---------------|
| Extreme Long Shot | Thiết lập bối cảnh, thể hiện không gian rộng |
| Long Shot | Toàn cảnh hành động trong môi trường |
| Medium Long Shot | Bao quát nhân vật + môi trường |
| Medium Shot | Cận trung, thể hiện biểu cảm |
| Close-up | Chi tiết thiết bị, thao tác tay, màn hình |
| Over-the-shoulder | Góc nhìn qua vai, nhân vật quan sát đối tượng |
| Point-of-View (POV) | Góc nhìn từ mắt nhân vật |

Shot type phải phù hợp với visual purpose. Nếu mismatch → cần xác nhận.

---

### 2. Reasoning / Inference Strategy

#### 2.1 Phân loại thông tin

| Loại | Định nghĩa | Ví dụ |
|------|-------------|-------|
| **Explicit** | Ghi rõ ràng, không thể hiểu sai | `Thời gian: 19:30`, `Loại shot: Close-up` |
| **Inference** | Suy ra hợp lý từ explicit, có cơ sở logic | Frame A 19:30, Frame B 19:31 → duration ≈ 1 phút |
| **Missing** | Thông tin quan trọng bị thiếu, không thể suy ra | Script không ghi thời gian ở frame có ý nghĩa timeline |

#### 2.2 Ưu tiên thông tin

- **Explicit > Inference**: Nếu explicit có sẵn, LUÔN dùng explicit.
- Inference chỉ dùng khi explicit không có, và phải có cơ sở logic rõ ràng.

#### 2.3 Giới hạn inference

**Inference KHÔNG được tạo ra**:
- Business rule mới (quy trình, nguyên tắc hoạt động)
- Timestamp mới (nếu script không có → `[NEEDS CONFIRMATION]`)
- Design decision (cách hiển thị, layout, màu sắc)
- Requirement mới (tính năng, hành vi chưa được script đề cập)

**Inference ĐƯỢC phép**:
- Duration giữa hai frame (chỉ khi cả hai đều có timestamp explicit)
- Mối quan hệ logic giữa các frame liền kề
- Xác định visual purpose từ context

#### 2.4 Inference về Duration

- **Chỉ tính duration** từ các timestamp explicit đã tồn tại trong script.
- **Không dùng duration suy ra** để tạo timestamp exact mới.
- Ví dụ: Frame A `19:30`, Frame B `19:31` → duration = 1 phút (hợp lý).
- Ví dụ sai: Frame A không có timestamp → tự suy ra `19:32` → **KHÔNG được phép**.

#### 2.5 Object Continuity

- **Không yêu cầu** mọi object phải xuất hiện liên tục ở mọi frame.
- **Chỉ yêu cầu** object xuất hiện ở những frame mà hành động / ngữ cảnh cần nó.
- Sự **xuất hiện** phải phù hợp: object được giới thiệu khi hành động cần sử dụng nó.
- Sự **biến mất** phải phù hợp: object không còn cần thiết cho hành động tiếp theo.
- Nếu object mới xuất hiện mà script không giải thích → `[NEEDS CONFIRMATION]`.

#### 2.6 Xây dựng Continuity Anchors

Khi đọc script, trước khi validate, phải xác định các **continuity anchors**:
1. **Character anchors**: Nhân vật chính, ngoại hình, trang phục.
2. **Object anchors**: Thiết bị quan trọng, lifecycle của chúng.
3. **Location anchors**: Địa điểm chính, vị trí cụ thể.
4. **Timeline anchors**: Các mốc thời gian explicit.
5. **State anchors**: Trạng thái thay đổi (xe đỗ → xe di chuyển, thẻ lấy → thẻ trả).

Dùng các anchors này để kiểm tra transition giữa từng frame.

#### 2.7 Kiểm tra Transition Frame N → N+1

Với mỗi cặp frame liền kề, kiểm tra:

| Dimension | Câu hỏi |
|-----------|---------|
| **Temporal** | Thời gian frame N+1 ≥ frame N? Khoảng cách hợp lý? Hỗ trợ cả timestamp đơn lẫn khoảng thời gian (start/end)? |
| **Spatial** | Vị trí frame N+1 logic so với frame N? |
| **Object** | Thiết bị xuất hiện / biến mất có phù hợp ngữ cảnh? |
| **Character** | Nhân vật nhất quán? Biểu cảm, hành động liền mạch? |
| **Action** | Hành động frame N+1 là kết quả logic của frame N? |

Nếu bất kỳ dimension nào mâu thuẫn → `[NEEDS CONFIRMATION]`.

#### 2.8 Kiểm tra Visual Adequacy

Với mỗi frame:
1. Mô tả hình ảnh có đủ chi tiết để hình dung?
2. Shot type phù hợp với visual purpose?
3. Yếu tố nhấn mạnh cần thiết không?
4. Chú thích bổ sung cho hình ảnh (không trùng, không mâu thuẫn)?

#### 2.9 Kiểm tra Shot Type vs Visual Purpose

- Xác định visual purpose từ context, mô tả, chú thích.
- So sánh với shot type script ghi.
- Nếu mismatch → `[NEEDS CONFIRMATION]`.
- Nếu script không ghi shot type → suy ra từ purpose → đánh dấu `[NEEDS CONFIRMATION]`.

---

### 3. Rules

#### 3.1 Source of Truth

- `input/script.md` là nguồn dữ liệu gốc duy nhất.
- **Không sửa** `input/script.md`.
- **Không tạo template** — nếu `templates/storyboard.md` chưa có, báo user.

#### 3.2 KHÔNG tạo

- Không tạo hình ảnh — storyboard chỉ là văn bản.
- Không bịa thông tin để hoàn thành frame.
- Không tạo business rule, timestamp, design decision, requirement mới.

#### 3.3 Temporal Validation

- Hỗ trợ cả **timestamp đơn** (`19:30`) và **khoảng thời gian** (`19:30–19:31`).
- Với khoảng thời gian: kiểm tra **end ≥ start**.
- Kiểm tra **overlap** giữa các frame tuần tự: thời gian frame N+1 không được overlap với frame N (trừ khi script mô tả hành động diễn ra đồng thời).
- **Không tự sửa timestamp** để loại bỏ conflict — nếu có mâu thuẫn temporal → `[NEEDS CONFIRMATION]`.

#### 3.4 Xử lý thiếu thông tin

- **Chỉ dùng `[NEEDS CONFIRMATION]`** khi thông tin thiếu ảnh hưởng đến: story logic, continuity, visual interpretation, hoặc output.
- Thông tin thiếu không quan trọng → bỏ qua, không đánh dấu.
- `[NEEDS CONFIRMATION]` phải mô tả: thiếu gì, tại sao quan trọng, gợi ý cách user cung cấp.

---

### 4. Validation Procedures

#### 4.1 Timeline Validation

1. Liệt kê tất cả timestamp explicit từ script.
2. Với timestamp đơn: kiểm tra frame trước ≤ frame sau.
3. Với khoảng thời gian: kiểm tra cả start và end đều ≥ frame trước; kiểm tra end ≥ start.
4. Kiểm tra overlap giữa các frame tuần tự (xem 3.3).
5. Nếu frame thiếu timestamp mà cần thiết → `[NEEDS CONFIRMATION]`.
6. Nếu user cung cấp timeline milestones → so sánh, tuân thủ.

#### 4.2 Character Validation

1. Xác định nhân vật chính từ script.
2. Kiểm tra nhất quán ngoại hình / trang phục giữa các frame (nếu mô tả).
3. Kiểm tra biểu cảm phù hợp với hành động / ngữ cảnh.
4. Nhân vật mới xuất hiện mà script không mô tả → `[NEEDS CONFIRMATION]`.

#### 4.3 Environment Validation

1. Xác định địa điểm từ script.
2. Kiểm tra logic di chuyển: vị trí N → vị trí N+1 phải khả thi.
3. Kiểm tra môi trường phù hợp với hành động.
4. Môi trường mới mà script không mô tả → `[NEEDS CONFIRMATION]`.

#### 4.4 Object/Device Validation

1. Liệt kê tất cả thiết bị / đạo cụ từ script.
2. Với mỗi object, xác định frame introduction và disappearance (nếu có).
3. Kiểm tra: object xuất hiện ở frame hành động cần nó? Biến mất khi không cần?
4. Object mới xuất hiện mà script không giải thích → `[NEEDS CONFIRMATION]`.

#### 4.5 Transition Validation

Dùng continuity anchors, kiểm tra 5 dimension (temporal, spatial, object, character, action) ở mục 2.7.
- Minor issue (có thể giải thích bằng inference) → ghi chú.
- Major issue (mâu thuẫn rõ ràng) → `[NEEDS CONFIRMATION]`.

#### 4.6 Shot Validation

1. Xác định visual purpose từ context.
2. So sánh shot type từ script.
3. Mismatch → `[NEEDS CONFIRMATION]`.
4. Script không ghi shot type → suy ra → đánh dấu `[NEEDS CONFIRMATION]`.

---

### 5. Failure Handling

| Tình huống | Xử lý |
|------------|--------|
| Thông tin quan trọng bị thiếu | `[NEEDS CONFIRMATION]` + mô tả thiếu gì |
| Timeline mâu thuẫn | `[NEEDS CONFIRMATION]` + nêu rõ mâu thuẫn |
| Shot type mismatch | `[NEEDS CONFIRMATION]` + đề xuất shot phù hợp |
| Business logic bất hợp lý | `[NEEDS CONFIRMATION]` + mô tả vấn đề |
| Frame structure chưa có | Phân tích → báo user xác nhận trước khi xuất |
| Template chưa tồn tại | Báo user, KHÔNG tự tạo |

---

### 6. Final Self-Check

Trước khi xuất output, LLM phải tự trả lời các câu hỏi:

| Check | Câu hỏi |
|-------|---------|
| **Source traceability** | Mọi thông tin trong storyboard đều có nguồn gốc từ `input/script.md`? Không có nội dung bịa đặt? |
| **Continuity anchors** | Đã xác định đầy đủ character, object, location, timeline, state anchors? |
| **Transition consistency** | Mỗi cặp frame N → N+1 đã kiểm tra temporal, spatial, object, character, action? |
| **Explicit / Inference distinction** | Đã phân biệt rõ explicit vs inference? Inference không tạo business rule, timestamp, design decision mới? |
| **[NEEDS CONFIRMATION]** | Tất cả mục thiếu thông tin quan trọng (ảnh hưởng story logic, continuity, visual interpretation, output) đã được đánh dấu? Liệt kê ở cuối output? |
| **Suitability for image generation** | Mỗi frame có đủ thông tin để sau này có thể dùng làm input cho image generation (visual description rõ ràng, shot type cụ thể)? |

Nếu bất kỳ câu trả lời là "KHÔNG" → phải chỉnh sửa trước khi xuất.
