# Validation Evidence Report
**Course:** Week 3 - Frontend Technologies: Web and Mobile  
**Assignment:** Homework 3A - UI Skeleton  
**Target:** Form Đăng Ký Thuê Sân Bóng Đá 11 Người  

Tài liệu này ghi nhận bằng chứng kiểm thử logic xác thực (Validation Matrix) của Form đặt sân bóng đá 11 người (`BookingForm.tsx`).

---

## 1. Bảng Ma Trận Ca Kiểm Thử (Validation Test Matrix)

| STT | Trường dữ liệu (Field) | Điều kiện kiểm thử (Test Case) | Dữ liệu nhập vào | Kết quả mong đợi (Expected Outcome) | Đạt / Không đạt |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-01** | Họ tên đại diện | Để trống khi submit | `""` (chuỗi rỗng) | Báo lỗi: *"Vui lòng nhập họ và tên người đại diện."* | **PASS** |
| **TC-02** | Họ tên đại diện | Quá ngắn (< 3 ký tự) | `"An"` | Báo lỗi: *"Họ tên phải có ít nhất 3 ký tự."* | **PASS** |
| **TC-03** | Họ tên đại diện | Nhập hợp lệ | `"Nguyễn Văn Hùng"` | Hợp lệ, không có thông báo lỗi. | **PASS** |
| **TC-04** | Tên đội bóng | Để trống khi submit | `""` (chuỗi rỗng) | Báo lỗi: *"Vui lòng nhập tên đội bóng thi đấu."* | **PASS** |
| **TC-05** | Tên đội bóng | Quá ngắn (< 3 ký tự) | `"FC"` | Báo lỗi: *"Tên đội bóng phải có ít nhất 3 ký tự."* | **PASS** |
| **TC-06** | Tên đội bóng | Nhập hợp lệ | `"FC Bách Khoa All-Stars"` | Hợp lệ, không có thông báo lỗi. | **PASS** |
| **TC-07** | Số điện thoại | Để trống | `""` | Báo lỗi: *"Vui lòng nhập số điện thoại để nhận mã xác nhận."* | **PASS** |
| **TC-08** | Số điện thoại | Nhập chữ / ký tự | `"abc0912345"` | Báo lỗi: *"Số điện thoại không hợp lệ (Phải là 10 chữ số đầu 03, 05, 07, 08, 09)."* | **PASS** |
| **TC-09** | Số điện thoại | Thiếu số (< 10 số) | `"09123456"` | Báo lỗi: *"Số điện thoại không hợp lệ (Phải là 10 chữ số đầu 03, 05, 07, 08, 09)."* | **PASS** |
| **TC-10** | Số điện thoại | Đầu số không hợp lệ | `"0123456789"` | Báo lỗi: *"Số điện thoại không hợp lệ (Phải là 10 chữ số đầu 03, 05, 07, 08, 09)."* | **PASS** |
| **TC-11** | Số điện thoại | Số điện thoại VN chuẩn | `"0988123456"` | Hợp lệ, ẩn thông báo lỗi. | **PASS** |
| **TC-12** | Ngày thi đấu | Ngày trong quá khứ | `2026-09-01` (< today) | Báo lỗi: *"Không thể đặt sân cho ngày trong quá khứ."* và bị thuộc tính `min` của thẻ input chặn. | **PASS** |
| **TC-13** | Khung giờ / Ca đá | Chọn ca thi đấu | Chọn Ca 3 (18:00 - 20:00) | Tự động cộng phụ thu đèn LED: `+200.000 VNĐ`. | **PASS** |
| **TC-14** | Dịch vụ bổ sung | Chọn trọng tài & bóng | Tích chọn Tổ trọng tài & Bóng thi đấu | Tự động cộng: `+600.000đ` và `+100.000đ` vào tổng tiền. | **PASS** |
| **TC-15** | Tiền cọc 30% | Tính cọc tự động | Tổng tiền = 3.400.000 VNĐ | Tiền cọc tự động cập nhật: `1.020.000 VNĐ` (30%). | **PASS** |
| **TC-16** | Cam kết điều khoản | Chưa tích chọn checkbox | `agreeTerms = false` | Báo lỗi: *"Bạn cần cam kết tuân thủ quy định sử dụng sân 11 người..."* | **PASS** |
| **TC-17** | Toàn bộ Form | Nhấn Submit khi form đúng | Dữ liệu hợp lệ tất cả trường | Nút hiển thị trạng thái *"Đang xử lý đặt sân..."*, tạo đơn mới và điều hướng sang tab Danh sách. | **PASS** |

---

## 2. Minh họa Trực quan Luồng Xác Thực

### Kịch bản 1: Submit Form Trống (Trường hợp Bắt lỗi tập trung)
```
[User bấm: "Xác Nhận Đặt Sân & Giữ Lịch Thi Đấu"]
   │
   ▼
[Hàm validateBookingForm() được kích hoạt]
   ├── Họ tên: Rỗng ──► Hiển thị: "Vui lòng nhập họ và tên người đại diện." (Đỏ + Icon)
   ├── Tên đội: Rỗng ──► Hiển thị: "Vui lòng nhập tên đội bóng thi đấu." (Đỏ + Icon)
   ├── Số ĐT: Rỗng ──► Hiển thị: "Vui lòng nhập số điện thoại để nhận mã xác nhận." (Đỏ + Icon)
   └── Cam kết: Chưa tích ──► Hiển thị thông báo cam kết bắt buộc.
   │
   ▼
[Chặn submit - Form không gửi đi, giữ nguyên vị trí cho người dùng sửa]
```

### Kịch bản 2: Real-time Inline Validation khi người dùng gõ
- Khi người dùng bắt đầu nhập số điện thoại và chuyển tiêu điểm (blur), nếu nhập sai định dạng thì viền input lập tức đổi sang màu đỏ kèm thông báo lỗi.
- Khi người dùng sửa đúng định dạng 10 số, viền đỏ tự động biến mất và viền đổi sang màu xanh emerald chuẩn xác.

---

## 3. Tiêu chí Accessibility (A11y) trong Form
1. Mọi ô nhập liệu đều có thẻ `<label>` tương ứng với `htmlFor`.
2. Khi trường có lỗi, thuộc tính `aria-invalid="true"` được bật tự động.
3. Thông báo lỗi có gán `id` tương ứng và được liên kết bằng `aria-describedby` giúp các công cụ đọc màn hình thông báo chính xác cho người dùng khiếm thị.
4. Các trường bắt buộc đều có dấu hoa thị đỏ `<span className="text-rose-400">*</span>` và mô tả rõ ràng.

