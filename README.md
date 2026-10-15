# 🎓 Cổng Thông tin Lý lịch Khoa học HCMUTE
### Scientific CV & Faculty Management Portal - HCMUTE
Phiên bản: **2.0.0 (Enterprise Architecture)**

Hệ thống quản lý, chuẩn hóa và tổng hợp hồ sơ lý lịch khoa học dành cho Giảng viên, Nghiên cứu sinh và Ban Quản trị / Hội đồng Tuyển dụng Trường Đại học Sư phạm Kỹ thuật TP.HCM. Tuân thủ nghiêm ngặt **Phụ lục III - Thông tư 09/2017/TT-BGDĐT** của Bộ Giáo dục và Đào tạo.

---

## 🌟 Điểm nổi bật của Dự án (Key Features)

1. **Hồ sơ Khoa học Toàn diện (7 Mục Chuẩn Hóa):**
   - **I. Thông tin cơ bản & Liên hệ:** Họ tên, Ngày sinh, CCCD (12 số), Quê quán, Địa chỉ (Gợi ý tự động OpenStreetMap), Chức danh, Chức vụ.
   - **II. Thông tin bổ sung:** Tùy chọn 5 nguyện vọng chuyên môn, Bảng Môn học giảng dạy & Bảng Hướng nghiên cứu chuyên sâu.
   - **III. Quá trình đào tạo:** Học vị Cử nhân / Kỹ sư / Thạc sĩ / Tiến sĩ, tách riêng trường **Hệ đào tạo** (Chính quy, Từ xa, VLVH,...) và **Tên đồ án / Luận văn / Luận án**.
   - **IV. Quá trình công tác:** Lịch sử công tác từ trước đến nay.
   - **V. Đề tài NCKH:** Các cấp đề tài (Nhà nước, Bộ, Tỉnh/TP, Cơ sở), chức vụ, kinh phí và xếp loại.
   - **VI. Công bố khoa học:** Bài báo tạp chí uy tín (ISI/Scopus Q1-Q4, Điểm HĐGSNN), sách giáo trình, đính kèm minh chứng PDF (tối đa 20MB).
   - **VII. Giải thưởng & Chuyển giao:** Giải thưởng KHCN, Bằng độc quyền sáng chế, Bằng khen.

2. **Chế độ Kép Giảng viên / Quản trị viên (Dual-Portal 1-Click Switcher):**
   - **Cổng Giảng viên (User):** Quản lý hồ sơ, xem trước A4 trực quan, xuất CV Word/PDF.
   - **Cổng Quản trị (Admin):** 8 thẻ chỉ số KPI toàn trường, biểu đồ phân bổ học vị & khoa viện, bảng xếp hạng Top công bố, tìm kiếm ứng viên theo 5 bộ lọc chuyên gia.

3. **Động cơ Trích xuất File Mẫu Đa tầng (Dual-Tier Import Engine):**
   - Đọc và bóc tách dữ liệu 100% chuẩn xác từ cả file **JSON** lẫn file **Word (.docx)**.
   - Tự động nhận diện khối AltChunk HTML và OpenXML cổ điển, hiển thị modal xem trước & lựa chọn từng mục trước khi ghép (Merge).

4. **Động cơ Xuất CV Đạt chuẩn In ấn:**
   - Xuất file **Word (.docx)** và **PDF** đồng bộ font chữ **Times New Roman**, căn lề chuẩn trang A4 Phụ lục III.

---

## 📁 Cấu trúc Thư mục Dự án (Project Directory Structure)

Dự án được tái cấu trúc từ dạng đơn tệp thành mô hình **Modular Clean Architecture**:

```text
d:\khanh\
├── docs/                        # Tài liệu kỹ thuật, sơ đồ kiến trúc & CSDL
│   ├── ARCHITECTURE.md          # Sơ đồ kiến trúc tổng thể (Mermaid diagrams)
│   ├── DATABASE_SCHEMA.md       # Cấu trúc 8 Sheets và quy tắc nghiệp vụ
│   └── ROADMAP.md               # Lộ trình phát triển cấp Viện - Trường
│
├── src/                         # MÃ NGUỒN MODULAR HỆ THỐNG
│   ├── client/                  # Frontend Web Application
│   │   ├── assets/              # Tài nguyên tĩnh & file mẫu chuẩn (.docx, .json)
│   │   ├── styles/              # CSS tách nhỏ theo chức năng
│   │   │   ├── main.css         # Theme Glassmorphism & giao diện ứng dụng
│   │   │   └── print-cv.css     # CSS in ấn chuẩn A4 Phụ lục III
│   │   └── js/                  # JavaScript phân tầng theo chức năng
│   │       ├── state.js         # Quản lý trạng thái ứng dụng (appData store)
│   │       ├── router.js        # Điều hướng Tab & Switcher Admin/User
│   │       ├── api.js           # Universal API Client (hỗ trợ cả GAS & Local REST)
│   │       ├── services/        # Dịch vụ nghiệp vụ cốt lõi
│   │       │   ├── cv-import.js # Động cơ trích xuất file mẫu (AltChunk + JSON)
│   │       │   └── cv-export.js # Động cơ xuất CV Word (.docx) & PDF
│   │       └── utils/           # Các tiện ích dùng chung
│   │           ├── helpers.js   # Xử lý chuỗi, dấu tiếng Việt, escape HTML
│   │           └── formatters.js# Định dạng số điện thoại, CCCD, ngày tháng
│   │
│   └── server/                  # Backend Service
│       ├── gas/                 # Google Apps Script Serverless (Tách module)
│       │   ├── Main.gs          # Entry point (doGet, routing)
│       │   ├── Config.gs        # Cấu hình Sheets, Headers và Constant
│       │   ├── Auth.gs          # Xác thực tài khoản Google & Phân quyền Admin
│       │   ├── Database.gs      # DAO & xử lý Ghi đè/Thêm mới Google Sheets
│       │   └── Candidates.gs    # Tổng hợp thống kê KPI & dữ liệu ứng viên
│       └── node/                # Local Dev Mock Server
│           ├── mock-db.json     # CSDL mẫu phục vụ phát triển offline
│           └── server.js        # REST API Server
│
├── scripts/                     # Tooling & Tự động hóa
│   ├── dev-server.js            # Máy chủ phát triển cục bộ (Zero-dependency)
│   └── build.js                 # Kiểm tra cú pháp và build bundle sản phẩm
│
├── tests/                       # Kiểm thử tự động (Unit & Integration)
│   ├── test-import.js           # Kiểm thử bóc tách file mẫu (.docx & .json)
│   ├── test-database.js         # Kiểm thử quy tắc ghi đè trên Sheet
│   └── run-all-tests.js         # Test Runner chạy toàn bộ test suites
│
├── package.json                 # Cấu hình dự án npm & scripts
├── .gitignore                   # Loại trừ file rác và dependencies
├── Code.gs                      # File Backend Production (sẵn sàng deploy lên GAS)
├── Index.html                   # File Frontend Production (sẵn sàng deploy lên GAS)
└── Login.html                   # Giao diện Đăng nhập Production
```

---

## 🚀 Hướng dẫn Cài đặt & Phát triển (Getting Started)

### 1. Yêu cầu Môi trường
- [Node.js](https://nodejs.org/) phiên bản 16.0 trở lên.
- Trình duyệt hiện đại (Chrome, Edge, Firefox, Safari).

### 2. Các Lệnh Điều hành Dự án (NPM Scripts)

```bash
# 1. Khởi chạy Máy chủ Phát triển Cục bộ (Local Dev Server):
npm run dev
# -> Mở trình duyệt tại http://localhost:3000 để chạy ứng dụng ngay lập tức mà không cần mạng internet.

# 2. Kiểm thử và Xác minh Toàn bộ Hệ thống:
npm test
# -> Tự động chạy tất cả các kịch bản kiểm thử (Test Cases) về trích xuất file và CSDL.

# 3. Build & Kiểm tra Mã nguồn:
npm run build
# -> Xác minh cú pháp toàn bộ file .gs và client .js, kiểm tra dung lượng bundle.
```

---

## 🌐 Hướng dẫn Triển khai Lên Google Apps Script (Production)

Hệ thống được thiết kế duy trì **tính tương thích ngược 100%**:
1. Đăng nhập vào trang quản trị [Google Apps Script](https://script.google.com/).
2. Sao chép nội dung file [`Code.gs`](file:///d:/khanh/Code.gs) vào trình soạn thảo code server.
3. Sao chép nội dung file [`Index.html`](file:///d:/khanh/Index.html) và [`Login.html`](file:///d:/khanh/Login.html) vào các file HTML tương ứng.
4. Nhấn **Deploy (Triển khai)** -> **New deployment (Triển khai mới)**:
   - Chọn loại: **Web app**.
   - Execute as: **Me (Tôi)**.
   - Who has access: **Anyone (Bất kỳ ai)** hoặc **Tất cả thành viên trong tổ chức HCMUTE**.
5. Nhận URL Web App chính thức để đưa vào sử dụng thực tế.

---

## 📈 Định hướng Nâng cấp Thực tế (Strategic Roadmap)

1. **Giai đoạn tiếp theo (Database mở rộng):** Kết nối thêm adapter PostgreSQL / Supabase để quản lý hàng nghìn giảng viên song song với Google Sheets.
2. **Giai đoạn AI (Trích xuất thông minh):** Tích hợp Gemini Flash API để đọc hiểu mọi file Word/PDF tự do và tự động điền vào form 7 mục.
3. **Đóng gói Docker:** Triển khai một lệnh `docker-compose up` chạy độc lập trên máy chủ nội bộ của Trường.
