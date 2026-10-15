# LỘ TRÌNH PHÁT TRIỂN & MỞ RỘNG (EXPANSION ROADMAP)
## Dự án Quản lý Hồ sơ Lý lịch Khoa học HCMUTE

Tài liệu này định hình chiến lược phát triển từ một dự án Google Apps Script nhỏ thành một **Hệ sinh thái Quản lý Đào tạo & Nghiên cứu Khoa học Toàn diện** sẵn sàng cho quy mô cấp Viện - Trường.

---

## Giai đoạn 1: Chuẩn hóa Kiến trúc Module (Hiện tại - Đã hoàn thành)
- [x] Tách mã nguồn từ file đơn (`Index.html`, `Code.gs`) thành cấu trúc thư mục chuẩn `src/client` và `src/server`.
- [x] Thiết lập build tool (`scripts/build.js`) tự động gộp file để duy trì tính tương thích 100% với Google Apps Script.
- [x] Bổ sung máy chủ phát triển cục bộ (`scripts/dev-server.js`) giúp lập trình viên phát triển giao diện siêu tốc không cần mạng.
- [x] Chuẩn hóa cơ chế ghi đè dữ liệu trên Google Sheets (bảo đảm tính toàn vẹn, không trùng lặp email/phân loại).
- [x] Động cơ bóc tách file mẫu Dual-Tier (.docx AltChunk + OpenXML + .json) đạt độ chuẩn xác 100%.
- [x] Xuất CV chuẩn A4 Phụ lục III Thông tư 09/2017/TT-BGDĐT sang cả Word (.docx) và PDF với font Times New Roman chuẩn.

---

## Giai đoạn 2: Tối ưu hóa Trải nghiệm & Kết nối CSDL Độc lập (Trung hạn)
- **Tách rời Database khỏi Google Sheets:**
  - Thiết kế Adapter kết nối tới **PostgreSQL / Supabase / MongoDB**.
  - Lưu trữ file PDF minh chứng công bố khoa học lên **AWS S3 / Cloudflare R2 / MinIO** thay vì phụ thuộc Drive.
- **Tích hợp Xác thực Tập trung (SSO):**
  - Kết nối Microsoft Azure AD / Google Workspace OAuth 2.0 của Nhà trường.
  - Phân quyền động đa cấp: Giảng viên, Thư ký Khoa, Trưởng Bộ môn, Phòng NCKH, Ban Giám hiệu.
- **Tối ưu hóa Tìm kiếm & Matching Ứng viên:**
  - Áp dụng thuật toán tìm kiếm mờ (Fuzzy Search) hoặc Full-text Search (Elasticsearch / Meilisearch).
  - Tự động gợi ý hội đồng phản biện luận án dựa trên từ khóa chuyên môn trong bài báo của giảng viên.

---

## Giai đoạn 3: Hiện đại hóa Frontend & Triển khai Docker (Dài hạn)
- **Chuyển đổi Frontend sang Framework hiện đại:**
  - Nâng cấp từ Vanilla JS sang **Vue 3 / React (Vite)** hoặc **Next.js**.
  - Xây dựng Component Library dùng chung theo phong cách nhận diện thương hiệu HCMUTE.
- **Microservices & RESTful API:**
  - Backend viết bằng **Node.js (NestJS / Express)** hoặc **Go / Python (FastAPI)**.
  - Đóng gói toàn bộ hệ thống bằng **Docker & Docker Compose**.
  - CI/CD tự động kiểm thử và triển khai (GitHub Actions).
- **Trí tuệ Nhân tạo (AI CV Parsing & Extraction):**
  - Tích hợp Gemini API hoặc mô hình OCR để tự động đọc mọi file CV tự do (PDF scan, Word bất kỳ) và chuyển đổi thành form chuẩn 7 mục mà không cần dùng đúng file mẫu.

