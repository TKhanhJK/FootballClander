# ⚽ FootballClander

Ứng dụng lịch thi đấu bóng đá — theo dõi trận đấu, xem lịch sử và thống kê, giao diện hiện đại xây dựng bằng React + TypeScript.

## ✨ Tính năng

- Xem lịch thi đấu bóng đá theo ngày/tuần/giải đấu
- Theo dõi kết quả và thống kê trận đấu
- Giao diện responsive, tối ưu cho cả desktop và mobile
- Backend API riêng phục vụ dữ liệu trận đấu

## 🛠️ Công nghệ sử dụng

**Frontend**
- [React](https://react.dev/) 18 + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) — build tool
- [TailwindCSS](https://tailwindcss.com/) — styling
- [Lucide React](https://lucide.dev/) — icon set

**Backend**
- [Express](https://expressjs.com/)
- [Zod](https://zod.dev/) — validate dữ liệu
- [tsx](https://github.com/privatenumber/tsx) — chạy TypeScript trực tiếp

**Testing**
- [Vitest](https://vitest.dev/)
- [Supertest](https://github.com/ladjs/supertest)

## 🚀 Bắt đầu

### Yêu cầu

- Node.js >= 18
- npm

### Cài đặt

```bash
git clone https://github.com/TKhanhJK/FootballClander.git
cd FootballClander
npm install
```

### Chạy dự án

Chạy frontend (dev mode):

```bash
npm run dev
```

Chạy server (backend API):

```bash
npm run server
```

Build production:

```bash
npm run build
```

Chạy test:

```bash
npm run test
```

## 📁 Cấu trúc thư mục

```
FootballClander/
├── data/         # Dữ liệu tĩnh / mẫu
├── docs/         # Tài liệu dự án
├── server/       # Backend Express API
├── src/          # Mã nguồn frontend React
├── index.html    # Entry point
└── package.json
```

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy fork repo, tạo branch mới và gửi pull request.

## 📄 Giấy phép

Chưa xác định giấy phép (thêm file `LICENSE` nếu bạn muốn mở nguồn chính thức).
