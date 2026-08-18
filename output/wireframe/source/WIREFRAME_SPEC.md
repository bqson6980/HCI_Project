# Wireframe Spec - Parking System

## Scope
Tai lieu nay mo ta cau truc wireframe low-fidelity duoc tao tu cac sketch trong thu muc `data/ui_design`.

Nguon doi chieu:
- `available_slot_overview.png`
- `receive_card.png`
- `available_slot_basementdetail.png`
- `check_position.png`
- `payment.png`

## Screen 1 - Tong quan cho trong
- Muc tieu: hien thi nhanh muc do day theo tang B1-B6.
- Layout:
  - Header tieu de man hinh.
  - Danh sach 6 dong theo tung tang, moi dong gom ma tang + so lieu `used/total`.
  - Legend 3 muc trang thai: day, gan day, con trong.
- Information hierarchy:
  - Uu tien 1: ten tang + cong suat.
  - Uu tien 2: trang thai tong quan qua ma ky hieu.

## Screen 2 - Nhan the khi gui xe
- Muc tieu: xac nhan thong tin vao bai va in/nhan the.
- Layout:
  - Cot trai: bien so, thoi gian vao, o placeholder camera.
  - Cot phai: bang gia theo khung gio.
  - CTA trung tam: nut nhan the.
  - Footer nho: ngay hien tai.
- Information hierarchy:
  - Uu tien 1: thong tin xe va gio vao.
  - Uu tien 2: gia theo khung gio.
  - Uu tien 3: hanh dong nhan the.

## Screen 3 - So do cho trong theo tang
- Muc tieu: cho nguoi dung chon khu do xe con trong o tang B2.
- Layout:
  - Header `Tang B2`.
  - Luoi 2 cot gom 4 khoi khu A/B/C/D.
  - Moi khoi: mini-grid vi tri + text `available/total`.
  - Legend + huong loi ra/vao.
- Information hierarchy:
  - Uu tien 1: vi tri trong/da do trong tung khu.
  - Uu tien 2: tong so cho trong cua khu.

## Screen 4 - Thông báo vị trí xe đỗ (Check Position)
- Muc tieu: Hien thi vi tri xe do cua nguoi dung dua tren anh phac thao `check_position.png`.
- Layout:
  - Header `Man hinh thong bao vi tri xe do`.
  - Luoi 2x2 gom 4 khu A/B/C/D.
  - Khu A, B, D hien thi o khung tong quan.
  - Khu C duoc nhan manh chi tiet voi mini-grid 2x3 va 1 o vi tri duoc highlight mau xanh/tich chon (vi tri xe do).
  - Goc duoi ben phai: bieu tuong nut `← 🧍` (Roi xe / Hoan tat).
- Information hierarchy:
  - Uu tien 1: vi tri xe do trong khu C được highlight.
  - Uu tien 2: hanh dong roi xe / hoan tat.

## Screen 5 - Thanh toan
- Muc tieu: hien thi thong tin phi va cho phep thanh toan bang the/QR.
- Layout:
  - Block thong tin phien gui xe (bien so, gio vao/ra, tam tinh).
  - 2 phuong thuc thanh toan: the va QR.
  - Modal QR voi nut dong + xac nhan.
  - Modal thanh cong voi nut dong.
- Information hierarchy:
  - Uu tien 1: so tien can thanh toan.
  - Uu tien 2: lua chon phuong thuc.
  - Uu tien 3: trang thai ket qua thanh toan.

## Validation checklist
- Da phan anh du 5 man hinh co trong sketch goc.
- Khong dua hinh anh minh hoa that, chi su dung placeholder va hinh khoi low-fi.
- Cac thanh phan chinh giu nguyen logic so voi sketch, khong them tinh nang lon ngoai pham vi.

## Assumptions
- Man hinh dich huong den kiosk/man hinh cam ung theo bo cuc doc.
- Cac gia tri bien so, gio, va so luong cho duoc dung lam du lieu mau minh hoa.
