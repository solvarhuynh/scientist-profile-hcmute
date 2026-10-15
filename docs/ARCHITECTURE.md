# KIẾN TRÚC HỆ THỐNG (SYSTEM ARCHITECTURE)
## Cổng Thông tin Lý lịch Khoa học HCMUTE (Scientific CV & Faculty Management Portal)

---

## 1. Tổng quan Kiến trúc (High-Level Overview)

Hệ thống được thiết kế theo mô hình **Hybrid Web Application** (Ứng dụng Web lai ghép):
- **Giai đoạn hiện tại (GAS Mode):** Chạy trực tiếp trên nền tảng **Google Apps Script (GAS)** kết hợp **Google Sheets** làm cơ sở dữ liệu phi máy chủ (Serverless), chi phí vận hành 0đ, triển khai tức thì trong hệ sinh thái Google Workspace của Trường.
- **Giai đoạn mở rộng (Production Modern Web Mode):** Được tổ chức theo mô hình **Modular Micro-Architecture**, cho phép tách rời Frontend (Vite/React/Vue hoặc Vanilla Modular) và Backend (Node.js/Express, Python FastAPI, hoặc Supabase/PostgreSQL) mà không cần viết lại nghiệp vụ cốt lõi.

```mermaid
graph TD
    subgraph "Client Layer (Frontend Browser)"
        UI["Modern Responsive UI<br/>(Tailwind CSS + Glassmorphism)"]
        Router["Client-Side Router<br/>(User Portal / Admin Portal)"]
        State["Application State Manager<br/>(appData / globalAdminData)"]
        ImportEngine["Dual-Tier Import Engine<br/>(AltChunk Docx + Mammoth + JSON)"]
        ExportEngine["CV Export Engine<br/>(A4 Preview / Word docx / PDF)"]
    end

    subgraph "API / Service Abstraction Layer"
        ApiClient["Universal API Client<br/>(Dual-Mode Adapter)"]
        GASRunner["Google Script Run Adapter<br/>(Production GAS)"]
        RestRunner["REST API / Mock Adapter<br/>(Local Dev & Scaled Backend)"]
    end

    subgraph "Backend Layer"
        subgraph "Google Apps Script Serverless"
            MainRouter["Main.gs (doGet / Routing)"]
            AuthService["Auth.gs (Google Auth & Admin RBAC)"]
            DBService["Database.gs (Sheets ORM & Upsert Logic)"]
            CandidateService["Candidates.gs (Candidate Filtering & KPI)"]
        end
        subgraph "Data Storage"
            GSheets[("Google Sheets Database<br/>8 Sheets Normalized")]
        end
    end

    UI --> Router
    Router --> State
    State --> ImportEngine
    State --> ExportEngine
    State --> ApiClient

    ApiClient -->|GAS Environment| GASRunner
    ApiClient -->|Local Dev / Standalone| RestRunner

    GASRunner --> MainRouter
    MainRouter --> AuthService
    MainRouter --> DBService
    MainRouter --> CandidateService
    DBService --> GSheets
```

---

## 2. Luồng Xử lý Dữ liệu (Data Flow)

### 2.1 Luồng Đồng bộ & Ghi đè Hồ sơ (Candidate Sync Flow)

```mermaid
sequenceDiagram
    autonumber
    actor U as Giảng viên (User)
    participant C as Client (Index.html)
    participant A as API Client
    participant S as Server (Database.gs)
    participant DB as Google Sheets

    U->>C: Cập nhật thông tin / Nhấn "Lưu hồ sơ"
    C->>A: saveToDatabase(category, payload)
    A->>S: google.script.run.saveToDatabase(...)
    S->>DB: Kiểm tra Email và Phân loại (Upsert Logic)
    alt Đã tồn tại dòng có cùng Email (+ cùng Phân loại)
        S->>DB: Ghi đè chính xác dòng hiện tại (Không trùng lặp)
    else Chưa tồn tại
        S->>DB: Thêm mới dòng dữ liệu vào cuối Sheet
    end
    DB-->>S: Xác nhận lưu thành công
    S-->>C: Trả về {success: true, msg: "Đã lưu..."}
    C-->>U: Hiển thị Toast thông báo thành công
```

### 2.2 Luồng Trích xuất File Mẫu 7 Mục (Dual-Tier Docx/JSON Import Flow)

```mermaid
sequenceDiagram
    autonumber
    actor U as Người dùng
    participant UI as Giao diện Hỗ trợ
    participant IE as Import Engine (cv-import.js)
    participant P as DOMParser (parseCvFromHtml)
    participant M as Modal Preview & Merge

    U->>UI: Tải lên file (.json hoặc .docx)
    alt File .json
        IE->>IE: JSON.parse() trực tiếp cấu trúc 7 mục
    else File .docx
        IE->>IE: Kiểm tra mã Magic PKZip (0x50 0x4B 0x03 0x04)
        alt Chứa khối AltChunk (word/afchunk.mht)
            IE->>IE: Trích xuất HTML nguyên bản từ afchunk.mht
            IE->>P: Bóc tách 14 bảng dữ liệu & 7 mục thông tin
        else File docx chuẩn OpenXML desktop
            IE->>IE: Mammoth.convertToHtml()
            IE->>P: Bóc tách văn bản và bảng từ HTML
        end
    end
    P-->>M: Trả về cấu trúc 7 mục chuẩn hóa
    M-->>U: Hiển thị bảng Xem trước với độ chuẩn xác (%)
    U->>M: Chọn các mục cần gộp và nhấn "Xác nhận Ghép dữ liệu"
    M->>UI: Cập nhật dữ liệu vào form & bảng hiển thị
```

---

## 3. Kiến trúc Phân quyền (Role-Based Access Control - RBAC)

Hệ thống phân định 2 vai trò cốt lõi với chuyển đổi 1 chạm (One-Click Switcher):
1. **User (Giảng viên / Ứng viên):**
   - Quản lý 7 mục hồ sơ cá nhân.
   - Xuất CV chuẩn Phụ lục III Thông tư 09/2017/TT-BGDĐT.
   - Nhập/Xuất file mẫu thông minh.
2. **Admin (Hội đồng Tuyển dụng / Quản trị viên Khoa & Trường):**
   - Xem thống kê thời gian thực toàn trường (8 KPI cards, 2 biểu đồ phân tích).
   - Tìm kiếm, lọc ứng viên theo 5 phân loại chuyên gia.
   - Xem nhanh và xuất hàng loạt CV ứng viên dạng Word (.docx) và PDF.
   - Phân quyền Quản trị viên cho email mới.
