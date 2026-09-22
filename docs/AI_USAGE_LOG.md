# AI Usage Log & Human Review Report
**Course:** Week 3 - Frontend Technologies: Web and Mobile  
**Assignment:** Homework 3A - UI Skeleton  
**Project:** PitchMaster 11 - Football Pitch 11-a-side Rental Management System  

---

## 1. Trả lời câu hỏi định hướng (Driving Question)

> **"If AI generates an interface, what must the engineer still understand and verify?"**  
> *(Khi AI sinh ra một giao diện người dùng, kỹ sư phần mềm vẫn bắt buộc phải hiểu và kiểm chứng những gì?)*

Qua việc triển khai dự án thực tế này, nhóm phát triển rút ra được 5 trụ cột then chốt mà một kỹ sư frontend phải nắm vững và kiểm soát khi phối hợp với AI:

### 1.1. Kiến trúc Component và Luồng Dữ liệu (State Management & Data Flow)
- **Vấn đề AI thường gặp:** AI thường sinh ra code gộp chung toàn bộ logic vào một component khổng lồ (monolithic component), hoặc lạm dụng quá nhiều biến `useState` rời rạc khiến ứng dụng bị re-render liên tục.
- **Kỹ sư phải kiểm chứng:** 
  - Phân rã giao diện thành các thành phần tái sử dụng độc lập (`Navbar`, `StateController`, `SkeletonLoader`, `EmptyState`, `ErrorState`, các màn hình chuyên biệt).
  - Xác định "Single Source of Truth": Quản lý danh sách đặt sân (`bookings`) và trạng thái giao diện (`uiState`) ở cấp cao nhất (`App.tsx`) và truyền qua props/callbacks một cách rõ ràng.

### 1.2. Logic Nghiệp vụ Biên (Edge Cases & Business Rules)
- **Vấn đề AI thường gặp:** AI tạo ra form với các trường cơ bản nhưng logic xác thực rất nông (ví dụ chỉ kiểm tra `input !== ''` hoặc dùng regex số điện thoại quốc tế không phù hợp với thị trường Việt Nam).
- **Kỹ sư phải kiểm chứng:**
  - Ràng buộc nghiệp vụ thuê sân bóng 11 người thực tế: Sân 11 người cần đá theo ca cố định 120 phút, có phụ thu tiền đèn chiếu sáng vào giờ cao điểm buổi tối.
  - Kiểm tra ngày đá không được nằm trong quá khứ (`min = today`).
  - Số điện thoại đại diện phải là đầu số hợp lệ của các nhà mạng viễn thông Việt Nam (`03, 05, 07, 08, 09`).
  - Tiền đặt cọc bắt buộc phải tính tự động 30% tổng chi phí để giữ sân.

### 1.3. Trạng thái Trải nghiệm Người dùng (UX States: Loading, Empty, Success, Error)
- **Vấn đề AI thường gặp:** AI thường chỉ thiết kế "Happy Path" (trạng thái lý tưởng khi có đủ dữ liệu đẹp mắt), bỏ quên trạng thái khi mạng chậm, khi danh sách rỗng sau khi lọc, hoặc khi API trả về lỗi 500.
- **Kỹ sư phải kiểm chứng:**
  - Bổ sung `SkeletonLoader` mô phỏng cấu trúc thẻ sân khi đang tải để giảm tải nhận thức cho người dùng.
  - Xây dựng `EmptyState` thân thiện kèm nút hành động định hướng (Call to Action) để người dùng không bị bối rối trước màn hình trắng.
  - Xây dựng `ErrorState` có thông báo lỗi cụ thể và nút "Thử lại" (Retry Mechanism).

### 1.4. Khả năng Tiếp cận (Web Accessibility - A11y) & Semantic HTML
- **Vấn đề AI thường gặp:** AI thường lạm dụng thẻ `<div>` và `<span onClick=...>` để làm nút bấm, thiếu thẻ `<label>`, thiếu thuộc tính `aria-invalid`, `aria-describedby` cho độc giả khiếm thị (screen readers).
- **Kỹ sư phải kiểm chứng:**
  - Sử dụng các thẻ chuẩn ngữ nghĩa (`<main>`, `<header>`, `<nav>`, `<article>`, `<section>`, `<aside>`).
  - Thêm đầy đủ `htmlFor`, `id`, `aria-invalid`, `aria-describedby` kết nối trực tiếp nhãn lỗi với ô nhập liệu.
  - Bổ sung `tabIndex={0}` và xử lý sự kiện bàn phím (`Enter`, `Space`) cho các thẻ lựa chọn ca đá và dịch vụ phụ trợ.

### 1.5. Thiết kế Đáp ứng (Responsive Usability)
- **Vấn đề AI thường gặp:** AI sinh ra bảng dữ liệu (Table) quá rộng làm vỡ khung hình trên màn hình điện thoại di động (chiều ngang 375px - 414px).
- **Kỹ sư phải kiểm chứng:**
  - Chuyển đổi linh hoạt: Trên Desktop hiển thị bảng dữ liệu đầy đủ chi tiết; trên Mobile tự động chuyển sang danh sách thẻ bài (Card view) xếp dọc trực quan, dễ thao tác ngón tay cái.
  - Thay thế thanh menu ngang bằng Mobile Drawer có nút đóng mở Hamburger.

---

## 2. Nhật ký Tương tác AI (Prompt & Code Evolution Log)

### Giai đoạn 1: Khởi tạo Kiến trúc & Navigation
- **Prompt gửi AI:**
  > "Hãy tạo khung giao diện React + Tailwind CSS cho hệ thống quản lý thuê sân bóng đá 11 người, gồm thanh điều hướng chính và 3 màn hình: Danh sách sân, Form đặt sân, và Danh sách đơn đặt."
- **Code do AI đề xuất ban đầu (Điểm yếu):**
  - AI gom toàn bộ code vào một file `App.jsx` dài hơn 600 dòng.
  - Không có kiểu dữ liệu TypeScript.
  - Không có cơ chế responsive trên mobile (thanh navbar bị tràn màn hình).
- **Human Review & Tinh chỉnh thực tế:**
  - Chuyển sang **TypeScript** với định nghĩa interface chặt chẽ tại `src/types/booking.ts`.
  - Tách thành các file màn hình chuyên biệt (`PitchDashboard.tsx`, `BookingForm.tsx`, `BookingList.tsx`).
  - Xây dựng `Navbar.tsx` hỗ trợ Drawer trượt trên Mobile và badge đếm số lượng đơn đặt đang hoạt động.

### Giai đoạn 2: Xây dựng Form và Validation
- **Prompt gửi AI:**
  > "Tạo một form đặt sân bóng đá gồm tên, số điện thoại, ngày giờ, loại sân, và nút xác nhận có kiểm tra dữ liệu."
- **Code do AI đề xuất ban đầu (Điểm yếu):**
  - Chỉ dùng `required` của HTML5, dễ bị bypass và giao diện báo lỗi trình duyệt mặc định không đồng bộ.
  - Regex số điện thoại sơ sài (`/^\d+$/`), chấp nhận cả chuỗi '123'.
  - Cho phép người dùng chọn ngày hôm qua trong quá khứ.
  - Không có thông báo lỗi inline hiển thị trực tiếp dưới từng ô input.
- **Human Review & Tinh chỉnh thực tế:**
  - Viết module độc lập `src/utils/validation.ts` với regex chuẩn số di động Việt Nam 10 số (`/^0[3|5|7|8|9][0-9]{8}$/`).
  - Thêm ràng buộc `min = today` và `max = 30 ngày tới`.
  - Thiết kế hệ thống state `touched` và `errors` hiển thị lỗi theo thời gian thực (real-time inline validation).
  - Tự động tính toán tổng tiền và cọc 30% khi người dùng thay đổi ca đá hoặc chọn thêm dịch vụ (trọng tài VFF, áo pitch, nước uống).

### Giai đoạn 3: Hiện thực hóa 4 Trạng thái UI (Loading, Empty, Success, Error)
- **Prompt gửi AI:**
  > "Làm thế nào để thể hiện đầy đủ 4 trạng thái Loading, Empty, Success và Error cho giảng viên kiểm tra dễ dàng nhất?"
- **Code do AI đề xuất ban đầu:**
  - Đề xuất tạo 4 trang riêng biệt hoặc phải sửa mã nguồn `true/false` thủ công trong code rồi compile lại.
- **Human Review & Sáng tạo giải pháp:**
  - Thiết kế component độc quyền **`StateController.tsx` (Homework 3A State Inspector)** đặt ở đầu trang.
  - Cung cấp các nút bấm chuyển đổi nhanh giữa **1. Loading**, **2. Empty**, **3. Success**, **4. Error**, và một nút **Giả lập API (1.2s)**.
  - Giúp người chấm bài hoặc sinh viên khi quay video màn hình có thể chứng minh toàn bộ 4 trạng thái chỉ trong vòng 10 giây mà không cần can thiệp code.

---

## 3. Tổng kết
AI là một trợ thủ đắc lực giúp đẩy nhanh tốc độ viết mã boilerplate và layout UI, nhưng **kỹ sư phần mềm là người quyết định chất lượng, tính an toàn, tính đúng đắn của logic nghiệp vụ và trải nghiệm toàn diện của người dùng cuối.**

