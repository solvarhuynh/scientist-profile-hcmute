# HCMUTE Scientific CV & Faculty Management Portal
## System Architecture & Technical Specifications

---

### 1. Architectural Overview
The system follows a modern decoupled Three-Tier Architecture:
- **Presentation Layer (Frontend)**: React 18, Vite, Tailwind CSS, Lucide Icons.
- **Application & Business Logic Layer (Backend API)**: Node.js, Express REST API, JSON Web Token (JWT) Authentication.
- **Data Layer (Database & Storage)**: Supabase (PostgreSQL 15+), Row Level Security (RLS), full-text search indexes.

```mermaid
graph TD
    User["Giảng viên / Nhà khoa học"] -->|Browser HTTPS| Client["React 18 + Vite (SPA)"]
    Admin["Quản trị viên (Admin)"] -->|Browser HTTPS| Client
    
    subgraph Frontend ["Client Tier (React + Vite)"]
        Client --> Components["Modular UI Components"]
        Components --> Sections["7 Hồ sơ Sections"]
        Components --> Modals["Export & Import Modals"]
        Components --> Services["Export / Import Engines"]
    end
    
    Client -->|REST API / JSON| Backend["Node.js + Express API Server"]
    Client -.->|Direct SDK Query (Optional)| SupabaseDB[("Supabase PostgreSQL DB")]
    
    subgraph Backend ["Server Tier (Node.js/Express)"]
        Backend --> AuthController["Auth Controller"]
        Backend --> ProfileController["Profile Controller (7 Sections)"]
        Backend --> CandidateController["Candidate Filter & Search"]
        Backend --> AdminController["Admin Privileges"]
    end
    
    Backend -->|PostgreSQL Protocol / Service Key| SupabaseDB
    
    subgraph Database ["Supabase Cloud"]
        SupabaseDB --> ProfilesTable["profiles"]
        SupabaseDB --> DegreesTable["degrees (Hệ & Đồ án riêng)"]
        SupabaseDB --> ProjectsTable["research_projects"]
        SupabaseDB --> PubsTable["publications & books"]
        SupabaseDB --> AwardsTable["awards"]
        SupabaseDB --> AdminsTable["admins"]
    end
```

---

### 2. Key Modules & Subsystems

#### 2.1 Quá trình đào tạo (Education Engine)
- Tách biệt hoàn toàn hai thuộc tính:
  1. `he_dao_tao`: Hệ đào tạo (Chính quy, Văn bằng 2, Từ xa, Vừa làm vừa học, Chất lượng cao, Liên thông).
  2. `ten_de_tai_luan_van`: Tên đồ án / Đề tài tốt nghiệp đại học, luận văn thạc sĩ, luận án tiến sĩ.

#### 2.2 Công cụ xuất CV Phụ lục III (CV Export Engine)
- Chuẩn hóa theo mẫu Phụ lục III - Thông tư 09/2017/TT-BGDĐT.
- Hỗ trợ xuất trực tiếp:
  - File Microsoft Word `.docx` chuẩn OpenXML qua `html-docx-js` và AltChunk fallback.
  - In ấn & Xuất định dạng A4 `.pdf` chuẩn vector.

#### 2.3 Công cụ trích xuất dữ liệu thông minh (CV Import Engine)
- Hỗ trợ file `.json` với độ chuẩn xác và toàn vẹn 100%.
- Hỗ trợ file `.docx` trích xuất thông tin qua `mammoth.js` và bộ giải mã AltChunk.

---

### 3. Triển khai (Deployment Strategy)
- **Frontend**: Triển khai dễ dàng trên Vercel, Netlify, Cloudflare Pages hoặc Docker.
- **Backend**: Triển khai trên Render, Railway, Fly.io hoặc VPS Ubuntu/Linux.
- **Database**: Lưu trữ trên Supabase Cloud với đầy đủ backup, RLS và Connection Pooling.
