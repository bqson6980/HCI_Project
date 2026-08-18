# Wireframe Generator

## Purpose
Phân tích bản vẽ phác thảo tay (hand sketch) hoặc mô tả yêu cầu để tạo ra cấu trúc Wireframe chi tiết (low-fidelity wireframe) nhằm định hình bố cục, phân cấp thông tin và luồng giao diện trước khi xây dựng prototype.

## Use this skill when
- Người dùng cung cấp bản vẽ phác thảo (hand sketch) trong thư mục `data/ui_design`.
- Dự án đang ở giai đoạn đầu của thiết kế UI/UX và cần chốt cấu trúc layout, bố cục thành phần trước khi lập trình.
- Cần chuẩn hóa các khối giao diện (header, navigation, content blocks, CTA, footer).

## Required inputs
Một hoặc nhiều thông tin sau:
- File ảnh sketch/bản phác thảo tại `data/ui_design`.
- Mô tả mục tiêu của màn hình và đối tượng người dùng chính.
- Danh sách các tính năng, trường dữ liệu hoặc nút bấm cần xuất hiện trên giao diện.

## Output
- Đường dẫn: `output/wireframe/source`
- File cấu trúc wireframe (Markdown mô tả chi tiết layout hoặc file HTML/CSS dạng wireframe thô đen-trắng).
- Bảng phân tích các khối thành phần (Component Breakdown) phục vụ trực tiếp cho bước làm Prototype.
- Ảnh screenshot wireframe trong thư mục `output/wireframe/res_img`

## Workflow
1. Đọc và phân tích các ảnh sketch tại đường dẫn `data/ui_design`.
2. Trích xuất toàn bộ bố cục (Layout Structure), hệ thống phân cấp thị giác và danh sách các phần tử UI.
3. Tạo tài liệu wireframe chi tiết (định nghĩa rõ vị trí, tỷ lệ, vùng nội dung).
4. Kiểm tra tính đầy đủ và nhất quán giữa wireframe với bản vẽ sketch.
5. Xuất kết quả wireframe và danh sách component để người dùng kiểm duyệt trước khi chuyển sang bước dựng Prototype.