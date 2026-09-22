# Kịch bản quay video minh chứng (Screen Recording Guide)
**Thời lượng đề xuất:** 60 - 90 giây  
**Độ phân giải khuyến nghị:** 1080p hoặc 720p Full screen  
**Công cụ quay nhanh:** Windows Game Bar (`Win + Alt + R`), OBS Studio, hoặc Loom  

---

## 🎬 Kịch Bản Từng Bước (Step-by-Step Script)

### [00:00 - 00:15] Giới thiệu tổng quan & Điều hướng (Navigation)
1. Mở trình duyệt tại `http://localhost:3000`.
2. Giới thiệu ngắn: *"Đây là Hệ thống Quản lý Cho thuê Sân bóng đá 11 người cho Homework 3A."*
3. Bấm chuyển đổi lần lượt qua các tab trên Navbar:
   - **Danh Sách Sân 11** (Trang chủ tổng quan).
   - **Đăng Ký Thuê Sân** (Form đặt sân).
   - **Lịch Đặt & Quản Lý** (Bảng quản lý ca thi đấu).
4. *(Tùy chọn)* Thu nhỏ trình duyệt về dạng màn hình điện thoại (hoặc bật F12 Mobile Mode) để thấy menu Hamburger và giao diện co giãn Responsive mượt mà.

### [00:15 - 00:35] Trình diễn 4 Trạng thái UI (Loading, Empty, Success, Error)
Trên thanh **Homework 3A State Inspector** ở đầu trang, bấm lần lượt:
1. Bấm **1. Loading**: Chỉ ra hiệu ứng Skeleton Loader đang giả lập tải danh sách thẻ sân bóng.
2. Bấm **2. Empty**: Chỉ ra giao diện khi không có sân khả dụng kèm icon sân bóng và nút *"Tạo Lịch Đặt Trước"*.
3. Bấm **4. Error**: Chỉ ra giao diện báo lỗi kết nối máy chủ HTTP 500 kèm nút *"Thử lại"* và gợi ý kỹ thuật.
4. Bấm **3. Success** (hoặc nút **Giả lập API 1.2s**): Hiển thị danh sách sân bóng hoàn chỉnh, có gắn ảnh và thông số sân chuẩn FIFA.

### [00:35 - 01:10] Kiểm chứng Form & Validation (Trọng tâm bài tập)
1. Chuyển sang tab **"Đăng Ký Thuê Sân"**.
2. **Test lỗi (Invalid Case):**
   - Giữ nguyên các ô trống, kéo xuống nhấn ngay nút **"Xác Nhận Đặt Sân & Giữ Lịch Thi Đấu"**.
   - Chỉ vào màn hình các thông báo lỗi màu đỏ xuất hiện: *Yêu cầu nhập họ tên*, *Yêu cầu nhập tên đội bóng*, *Số điện thoại không hợp lệ*, *Chưa cam kết điều khoản*.
   - Nhập thử số điện thoại sai định dạng (ví dụ `12345`) để thấy báo lỗi ngay lập tức.
3. **Test thành công (Valid Case):**
   - Bấm nút **"Điền Mẫu Nhanh"** ở góc trên form (nút có icon ngôi sao ✦).
   - Chỉ ra: Các trường đã được điền dữ liệu chuẩn.
   - Thử tích chọn thêm **"Tổ Trọng Tài VFF"** và **"Bóng Thi Đấu"** -> Chỉ ra bảng chi phí tự động cập nhật tổng tiền và tính toán khoản cọc 30% chính xác.
   - Bấm **"Xác Nhận Đặt Sân"** -> Nút chuyển trạng thái xoay *"Đang xử lý đặt sân..."*, hiển thị thông báo popup xanh thành công và tự động điều hướng sang tab Quản lý lịch.

### [01:10 - 01:30] Thao tác Quản lý Đơn & Kết thúc
1. Tại tab **Lịch Đặt & Quản Lý**:
   - Chỉ vào đơn mới vừa được tạo xuất hiện ngay đầu danh sách.
   - Bấm nút **"Nhận Cọc"** để chuyển trạng thái từ *Chờ cọc* sang *Đã cọc & Xác nhận*.
   - Bấm nút icon **"Biên nhận"** để mở modal xem phiếu xác nhận thuê sân 11 người.
2. Kết thúc video với lời kết ngắn gọn: *"Hệ thống đáp ứng trọn vẹn yêu cầu điều hướng, form validation, 4 trạng thái UI và thiết kế responsive."*

