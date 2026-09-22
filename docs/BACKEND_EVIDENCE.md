# Backend Vertical Slice Evidence Report
**Course:** Week 4 - Backend Technologies: Data Protection, Business Rules, and Operations  
**Assignment:** Homework 4A - Backend Vertical Slice  
**Project:** PitchMaster 11 - 11-a-side Football Pitch Rental Management System  

---

## 1. Trả Lời Câu Hỏi Định Hướng (Driving Question)

> **"How does the server protect data, enforce business rules, and remain operable after deployment?"**  
> *(Làm thế nào máy chủ bảo vệ dữ liệu, thực thi quy tắc nghiệp vụ và duy trì khả năng vận hành liên tục sau khi triển khai?)*

Qua việc hiện thực lát cắt dọc Backend (Vertical Slice) cho hệ thống **PitchMaster 11**, 3 trụ cột kỹ thuật cốt lõi được chứng minh như sau:

### 1.1. Protect Data (Bảo Vệ Dữ Liệu)
- **Input Validation:** Sử dụng cơ chế kiểm tra schema chặt chẽ ở tầng Controller và Service, chặn đứng dữ liệu rác, chuỗi độc hại, số điện thoại sai chuẩn trước khi chạm tới cơ sở dữ liệu.
- **Data Layer Separation:** Ứng dụng mô hình kiến trúc phân lớp (*Layered Architecture: Controller $\leftrightarrow$ Service $\leftrightarrow$ Repository*). Tầng Controller không được thao tác trực tiếp với file lưu trữ, đảm bảo tính toàn vẹn dữ liệu.
- **Secrets Protection:** Toàn bộ thông tin nhạy cảm (`PORT`, `API_SECRET_KEY`, `CORS_ORIGIN`, `DATA_DIR`) được quản lý qua biến môi trường (`.env`). File `.env` được đưa vào `.gitignore` để không bao giờ bị lộ lên Git repository, đồng thời cung cấp `.env.example` làm mẫu cấu hình an toàn.
- **Atomic Persistence:** Cơ chế ghi file nguyên tử (Atomic write via temporary file) giúp dữ liệu trong `bookings.json` không bị lỗi hỏng (corrupted) kể cả khi máy chủ bị mất điện hay tắt đột ngột trong lúc ghi.

### 1.2. Enforce Business Rules (Thực Thi Quy Tắc Nghiệp Vụ)
- **Chặn trùng ca thi đấu (Double-booking / Slot Conflict):** Khi có yêu cầu đặt sân, máy chủ kiểm tra xem đã có đơn đặt nào đang active tại cùng một sân, cùng ngày và cùng ca đá hay chưa. Nếu đã có, máy chủ lập tức từ chối với mã **`409 Conflict`** và thông điệp rõ ràng, bảo vệ khách hàng khỏi việc tranh chấp sân.
- **Ràng buộc thời gian:** Chặn đặt sân cho các ngày trong quá khứ (`min = today`) với mã **`400 Bad Request`**.
- **Tính toán tài chính tự động:** Tự động tính phụ thu đèn chiếu sáng giờ vàng (`+200.000đ` cho ca tối) và tiền cọc bắt buộc `30%` tổng chi phí ngay trên máy chủ (Server-side calculation), ngăn chặn hoàn toàn việc client cố tình sửa giá tiền gửi lên.

### 1.3. Remain Operable After Deployment (Vận Hành Ổn Định Sau Triển Khai)
- **Health Check Endpoint:** `GET /api/health` cung cấp thông tin liveness/readiness (uptime, timestamp, trạng thái kết nối CSDL, mức tiêu thụ RAM) cho các hệ thống giám sát tự động (AWS ALB, Kubernetes, Docker Healthcheck).
- **Structured Logging:** Mỗi HTTP request được gắn một `X-Request-Id` duy nhất, ghi lại chi tiết: thời gian ISO, method, URL, status code, và latency (ms). Khi xảy ra lỗi (4xx, 5xx), log in ra payload JSON có cấu trúc để phục vụ điều tra (observability).
- **Containerization:** Đóng gói toàn bộ dịch vụ qua `Dockerfile` và `docker-compose.yml` với volume mapping bền vững, đảm bảo triển khai nhất quán và tự phục hồi khi có sự cố (`restart: unless-stopped`).

---

## 2. Minh Chứng Kiểm Thử Tự Động (Test Output Evidence)

Hệ thống sử dụng **Vitest** kết hợp **Supertest** để kiểm thử tự động toàn diện các endpoints mà không phụ thuộc vào trình duyệt.

### Kết quả chạy lệnh `npm test`:
```bash
> pitch-master-11@1.0.0 test
> vitest run

 RUN  v3.2.7 C:/Users/JIKAYWK/OneDrive/Documents/HK6/NewTech

stdout | server/tests/health.test.ts > Health Check API > GET /api/health - should return 200 OK with server health stats
[2026-09-15T03:35:00.983Z] ✅ [b6126097] GET /api/health -> 200 (5ms)

 ✓ server/tests/health.test.ts (1 test) 21ms
stdout | server/tests/booking.test.ts > Pitch Booking API Vertical Slice > POST /api/bookings - [VALID REQUEST] should create a booking with 201 Created and calculate 30% deposit
[2026-09-15T03:35:00.994Z] ✅ [eb290d37] POST /api/bookings -> 201 (8ms)

stdout | server/tests/booking.test.ts > Pitch Booking API Vertical Slice > POST /api/bookings - [INVALID REQUEST: Missing Fields] should return 400 Bad Request
[2026-09-15T03:35:01.005Z] ⚠️ [fd753e2f] POST /api/bookings -> 400 (1ms)
   ↳ Log Detail: {"timestamp":"2026-09-15T03:35:01.005Z","requestId":"fd753e2f","method":"POST","path":"/api/bookings","statusCode":400,"durationMs":1,"ip":"::ffff:127.0.0.1","userAgent":"unknown"}

stdout | server/tests/booking.test.ts > Pitch Booking API Vertical Slice > POST /api/bookings - [INVALID REQUEST: Invalid Phone] should reject bad phone format with 400
[2026-09-15T03:35:01.012Z] ⚠️ [5d899c6a] POST /api/bookings -> 400 (1ms)
   ↳ Log Detail: {"timestamp":"2026-09-15T03:35:01.012Z","requestId":"5d899c6a","method":"POST","path":"/api/bookings","statusCode":400,"durationMs":1,"ip":"::ffff:127.0.0.1","userAgent":"unknown"}

stdout | server/tests/booking.test.ts > Pitch Booking API Vertical Slice > POST /api/bookings - [INVALID REQUEST: Past Date] should reject past dates with 400
[2026-09-15T03:35:01.018Z] ⚠️ [d58a8d0d] POST /api/bookings -> 400 (0ms)
   ↳ Log Detail: {"timestamp":"2026-09-15T03:35:01.018Z","requestId":"d58a8d0d","method":"POST","path":"/api/bookings","statusCode":400,"durationMs":0,"ip":"::ffff:127.0.0.1","userAgent":"unknown"}

stdout | server/tests/booking.test.ts > Pitch Booking API Vertical Slice > POST /api/bookings - [BUSINESS RULE: 409 Conflict] should reject duplicate booking on same pitch, date, and slot
[2026-09-15T03:35:01.026Z] ⚠️ [0625ff3e] POST /api/bookings -> 409 (2ms)
   ↳ Log Detail: {"timestamp":"2026-09-15T03:35:01.026Z","requestId":"0625ff3e","method":"POST","path":"/api/bookings","statusCode":409,"durationMs":2,"ip":"::ffff:127.0.0.1","userAgent":"unknown"}

stdout | server/tests/booking.test.ts > Pitch Booking API Vertical Slice > GET /api/bookings - should return list of persistent bookings with 200 OK
[2026-09-15T03:35:01.033Z] ✅ [c1fb754d] GET /api/bookings -> 200 (3ms)

stdout | server/tests/booking.test.ts > Pitch Booking API Vertical Slice > PATCH /api/bookings/:id/status - should update status with 200 OK
[2026-09-15T03:35:01.048Z] ✅ [1356e078] PATCH /api/bookings/BK-2026-090/status -> 200 (4ms)

 ✓ server/tests/booking.test.ts (7 tests) 82ms

 Test Files  2 passed (2)
      Tests  8 passed (8)
   Start at  10:34:58
   Duration  2.18s
```

---

## 3. Các Ví Dụ Yêu Cầu & Phản Hồi API (Request Examples Evidence)

### 3.1. Health Check (`GET /api/health`)
**Request:**
```http
GET /api/health HTTP/1.1
Host: localhost:5000
Accept: application/json
```
**Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2026-09-15T03:35:00.983Z",
  "uptime": "12s",
  "service": "PitchMaster 11 Backend API",
  "version": "1.0.0",
  "environment": "development",
  "database": {
    "connected": true,
    "type": "persistent-json-store",
    "records": {
      "bookings": 3
    }
  },
  "memory": {
    "rssMb": "42.15",
    "heapUsedMb": "18.32"
  }
}
```

---

### 3.2. Đặt Sân Thành Công (`POST /api/bookings` - 201 Created)
**Request:**
```http
POST /api/bookings HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "customerName": "Lê Minh Quân",
  "teamName": "FC Chiến Binh Cầu Giấy",
  "phone": "0988654321",
  "pitchId": "pitch-01",
  "date": "2026-10-15",
  "timeSlotId": "slot-3",
  "addons": ["referee", "water"],
  "notes": "Trận bóng giao hữu công ty",
  "agreeTerms": true
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "message": "Đăng ký thuê sân bóng đá 11 người thành công!",
  "data": {
    "id": "BK-2026-742",
    "customerName": "Lê Minh Quân",
    "teamName": "FC Chiến Binh Cầu Giấy",
    "phone": "0988654321",
    "pitchId": "pitch-01",
    "pitchName": "Sân Vận Động Trung Tâm A1",
    "date": "2026-10-15",
    "timeSlotId": "slot-3",
    "timeSlotLabel": "Ca Tối Vàng (18:00 - 20:00) [Đèn LED]",
    "addons": ["referee", "water"],
    "totalAmount": 3300000,
    "depositAmount": 990000,
    "status": "pending",
    "notes": "Trận bóng giao hữu công ty",
    "createdAt": "2026-09-15 10:35:00",
    "updatedAt": "2026-09-15 10:35:00"
  }
}
```

---

### 3.3. Dữ Liệu Không Hợp Lệ (`POST /api/bookings` - 400 Bad Request)
**Request:**
```http
POST /api/bookings HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "customerName": "",
  "teamName": "",
  "phone": "0123456789",
  "date": "2020-01-01",
  "agreeTerms": false
}
```
**Response (400 Bad Request):**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Dữ liệu yêu cầu đặt sân không hợp lệ.",
  "errors": [
    "Họ và tên người đại diện phải có ít nhất 3 ký tự.",
    "Tên đội bóng thi đấu phải có ít nhất 3 ký tự.",
    "Số điện thoại không hợp lệ (Phải là 10 chữ số chuẩn đầu số VN 03, 05, 07, 08, 09).",
    "Vui lòng chọn 1 sân bóng đá 11 người.",
    "Vui lòng chọn ca thi đấu.",
    "Bạn cần cam kết tuân thủ quy định sử dụng sân 11 người và bảo dưỡng mặt cỏ.",
    "Không thể đặt sân cho ngày trong quá khứ."
  ],
  "requestId": "fd753e2f"
}
```

---

### 3.4. Chặn Trùng Lịch Ca Đá (`POST /api/bookings` - 409 Conflict)
**Request (Đặt trùng sân A1, ngày 2026-10-15, ca tối slot-3 đã có đội đặt):**
```http
POST /api/bookings HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "customerName": "Phạm Minh Tuấn",
  "teamName": "FC Đối Thủ Tranh Sân",
  "phone": "0912999888",
  "pitchId": "pitch-01",
  "date": "2026-10-15",
  "timeSlotId": "slot-3",
  "agreeTerms": true
}
```
**Response (409 Conflict):**
```json
{
  "success": false,
  "statusCode": 409,
  "message": "Xung đột lịch đặt (409 Conflict): Sân Vận Động Trung Tâm A1 vào ngày 2026-10-15 (Ca Tối Vàng (18:00 - 20:00) [Đèn LED]) đã được đội 'FC Chiến Binh Cầu Giấy' đặt trước. Vui lòng chọn ca hoặc ngày khác.",
  "requestId": "0625ff3e"
}
```

---

## 4. Minh Chứng Nhật Ký Máy Chủ (Log Evidence)

Trích xuất nhật ký chạy máy chủ trong quá trình thực hiện các requests:
```text
======================================================
⚽ PitchMaster 11 - Backend Service Running
======================================================
📡 Server Address: http://localhost:5000
🌍 Environment:    development
🔒 Secret Key:     pm1...0b4 (Protected)
📂 Data Storage:   C:\Users\JIKAYWK\OneDrive\Documents\HK6\NewTech\server\data
------------------------------------------------------
[2026-09-15T03:35:00.983Z] ✅ [b6126097] GET /api/health -> 200 (5ms)
[2026-09-15T03:35:00.994Z] ✅ [eb290d37] POST /api/bookings -> 201 (8ms)
[2026-09-15T03:35:01.005Z] ⚠️ [fd753e2f] POST /api/bookings -> 400 (1ms)
   ↳ Log Detail: {"timestamp":"2026-09-15T03:35:01.005Z","requestId":"fd753e2f","method":"POST","path":"/api/bookings","statusCode":400,"durationMs":1,"ip":"::ffff:127.0.0.1","userAgent":"unknown"}
[2026-09-15T03:35:01.026Z] ⚠️ [0625ff3e] POST /api/bookings -> 409 (2ms)
   ↳ Log Detail: {"timestamp":"2026-09-15T03:35:01.026Z","requestId":"0625ff3e","method":"POST","path":"/api/bookings","statusCode":409,"durationMs":2,"ip":"::ffff:127.0.0.1","userAgent":"unknown"}
[2026-09-15T03:35:01.033Z] ✅ [c1fb754d] GET /api/bookings -> 200 (3ms)
[2026-09-15T03:35:01.048Z] ✅ [1356e078] PATCH /api/bookings/BK-2026-090/status -> 200 (4ms)
```

---

## 5. Minh Chứng Lưu Trữ Dữ Liệu Bền Vững (Data Proof)

Dữ liệu được lưu trữ tại file: `server/data/bookings.json`.

### Kịch bản kiểm chứng tính bền vững:
1. Tạo đơn đặt mới qua API `POST /api/bookings` với mã `BK-2026-742`.
2. Dữ liệu được ghi lập tức xuống file `server/data/bookings.json`.
3. Tắt toàn bộ máy chủ (`Ctrl+C` hoặc `kill process`).
4. Khởi động lại máy chủ bằng `npm run server:start`.
5. Gọi `GET /api/bookings` hoặc `GET /api/health` -> Đơn `BK-2026-742` vẫn tồn tại nguyên vẹn với đầy đủ thông tin cọc và trạng thái.

---

## 6. Hướng Dẫn Nộp Bài (Submission Steps)

Thực hiện commit toàn bộ mã nguồn Backend lên Git:
```bash
# 1. Khởi tạo git (nếu chưa có)
git init

# 2. Thêm tất cả tệp (.env đã được loại trừ tự động nhờ .gitignore)
git add .

# 3. Tạo commit nộp bài
git commit -m "feat(backend): complete Week 4 Homework 4A vertical slice with validation, persistence, health check, and tests"
```

