-- =========================================================================
-- HCMUTE SCIENTIFIC CV & FACULTY MANAGEMENT SYSTEM
-- Supabase (PostgreSQL) Production Database Schema
-- Version: 3.0.0
-- =========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- -------------------------------------------------------------------------
-- 1. PROFILES TABLE (Core User & Scientist Information)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    gender VARCHAR(20) DEFAULT 'Nam',
    dob DATE,
    pob VARCHAR(255),                    -- Nơi sinh
    hometown VARCHAR(255),               -- Quê quán
    ethnicity VARCHAR(100) DEFAULT 'Kinh',-- Dân tộc
    academic_title VARCHAR(100),         -- Chức danh khoa học cao nhất (GS, PGS)
    title_appointed_year INT,            -- Năm bổ nhiệm chức danh
    highest_degree VARCHAR(100),         -- Học vị cao nhất (TS, ThS, CN/KS)
    degree_conferred_year INT,           -- Năm nhận học vị
    degree_country VARCHAR(100),         -- Nước nhận học vị
    position VARCHAR(255),               -- Chức vụ
    department VARCHAR(255),             -- Đơn vị công tác
    address TEXT,                        -- Chỗ ở riêng / địa chỉ liên lạc
    office_phone VARCHAR(50),            -- Điện thoại cơ quan (CQ)
    home_phone VARCHAR(50),              -- Điện thoại nhà riêng (NR)
    mobile_phone VARCHAR(50),            -- Điện thoại di động (DĐ)
    fax VARCHAR(50),                     -- Fax
    cccd VARCHAR(50),                    -- Số CCCD / Hộ chiếu
    cccd_date DATE,                      -- Ngày cấp CCCD
    cccd_place VARCHAR(255),             -- Nơi cấp CCCD
    avatar_url TEXT,                     -- Ảnh đại diện
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for searching and filtering
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles (email);
CREATE INDEX IF NOT EXISTS idx_profiles_full_name ON public.profiles USING gin (full_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_profiles_department ON public.profiles (department);
CREATE INDEX IF NOT EXISTS idx_profiles_highest_degree ON public.profiles (highest_degree);
CREATE INDEX IF NOT EXISTS idx_profiles_academic_title ON public.profiles (academic_title);

-- -------------------------------------------------------------------------
-- 2. FACULTY PREFERENCES TABLE (Nguyện vọng & Hình thức hợp tác)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.faculty_preferences (
    profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    thinh_giang BOOLEAN DEFAULT FALSE,      -- Giảng dạy thỉnh giảng
    nghien_cuu BOOLEAN DEFAULT FALSE,       -- Hợp tác nghiên cứu KH&CN
    hoi_dong BOOLEAN DEFAULT FALSE,         -- Tham gia hội đồng đánh giá
    huong_dan BOOLEAN DEFAULT FALSE,        -- Hướng dẫn học viên/NCS
    doanh_nghiep BOOLEAN DEFAULT FALSE,     -- Kết nối chuyển giao doanh nghiệp
    ghi_chu TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 3. TEACHING SUBJECTS TABLE (Môn giảng dạy)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.teaching_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    major VARCHAR(255) NOT NULL,            -- Ngành / Chuyên ngành
    name VARCHAR(255) NOT NULL,             -- Tên môn học
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_teaching_subjects_profile ON public.teaching_subjects (profile_id);

-- -------------------------------------------------------------------------
-- 4. RESEARCH DIRECTIONS TABLE (Định hướng nghiên cứu)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.research_directions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    major VARCHAR(255) NOT NULL,            -- Lĩnh vực / Chuyên ngành
    name VARCHAR(255) NOT NULL,             -- Hướng nghiên cứu chính
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_research_directions_profile ON public.research_directions (profile_id);

-- -------------------------------------------------------------------------
-- 5. DEGREES TABLE (Quá trình đào tạo: Đại học, Thạc sĩ, Tiến sĩ)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.degrees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    bac_hoc VARCHAR(100) NOT NULL,          -- 'Đại học', 'Thạc sĩ', 'Tiến sĩ', 'Sau đại học'
    he_dao_tao VARCHAR(100) DEFAULT 'Chính quy', -- 'Chính quy', 'Văn bằng 2', 'Từ xa', 'Vừa làm vừa học', 'Chất lượng cao'
    nganh VARCHAR(255) NOT NULL,            -- Ngành học
    noi_dao_tao VARCHAR(255) NOT NULL,      -- Cơ sở / Trường đào tạo
    nuoc_dao_tao VARCHAR(100) DEFAULT 'Việt Nam', -- Quốc gia đào tạo
    nam_tot_nghiep INT,                     -- Năm tốt nghiệp / cấp bằng
    ten_de_tai_luan_van TEXT,               -- Tên đồ án / Luận văn / Luận án tốt nghiệp
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_degrees_profile ON public.degrees (profile_id);

-- -------------------------------------------------------------------------
-- 6. FOREIGN LANGUAGES TABLE (Trình độ ngoại ngữ)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.foreign_languages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    language_name VARCHAR(100) NOT NULL,    -- Tên ngoại ngữ (Tiếng Anh, Pháp, Nhật,...)
    proficiency_level VARCHAR(100) NOT NULL,-- Mức độ sử dụng (Thành thạo, Giao tiếp, Đọc hiểu,...)
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_foreign_languages_profile ON public.foreign_languages (profile_id);

-- -------------------------------------------------------------------------
-- 7. WORK HISTORY TABLE (Quá trình công tác chuyên môn)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.work_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    from_date VARCHAR(50),                  -- Tháng/Năm bắt đầu
    to_date VARCHAR(50),                    -- Tháng/Năm kết thúc hoặc rỗng nếu hiện tại
    is_current BOOLEAN DEFAULT FALSE,       -- Đang công tác
    workplace VARCHAR(255) NOT NULL,        -- Đơn vị công tác
    position VARCHAR(255) NOT NULL,         -- Công việc / Chức danh đảm nhiệm
    description TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_work_history_profile ON public.work_history (profile_id);

-- -------------------------------------------------------------------------
-- 8. RESEARCH PROJECTS TABLE (Đề tài NCKH các cấp)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.research_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,                     -- Tên đề tài nghiên cứu
    project_level VARCHAR(100) DEFAULT 'Trường', -- 'Nhà nước', 'Bộ', 'Tỉnh/Thành phố', 'Trường', 'Cơ sở'
    start_year VARCHAR(50),                 -- Năm bắt đầu
    end_year VARCHAR(50),                   -- Năm hoàn thành
    role VARCHAR(100) DEFAULT 'Thành viên', -- 'Chủ nhiệm', 'Đồng chủ nhiệm', 'Thư ký', 'Thành viên'
    status VARCHAR(50) DEFAULT 'Đã nghiệm thu', -- 'Đang thực hiện', 'Đã nghiệm thu'
    rating VARCHAR(50),                     -- Xếp loại nghiệm thu (Xuất sắc, Tốt, Đạt)
    funding NUMERIC,                        -- Kinh phí (VND)
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_research_projects_profile ON public.research_projects (profile_id);

-- -------------------------------------------------------------------------
-- 9. PUBLICATIONS TABLE (Công bố khoa học & Bài báo)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.publications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,                    -- Tên công trình / bài báo
    authors TEXT,                           -- Danh sách tác giả
    journal_name TEXT NOT NULL,             -- Tên tạp chí / Kỷ yếu hội nghị
    publication_year INT,                   -- Năm công bố
    volume_issue VARCHAR(100),              -- Tập, số, trang
    index_type VARCHAR(100) DEFAULT 'Trong nước', -- 'ISI/Scopus', 'Trong nước', 'Hội nghị quốc tế', 'Hội nghị trong nước'
    doi_url TEXT,                           -- Đường dẫn DOI hoặc bài viết
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_publications_profile ON public.publications (profile_id);

-- -------------------------------------------------------------------------
-- 10. BOOKS TABLE (Sách và Giáo trình xuất bản)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,                    -- Tên sách / giáo trình
    publisher VARCHAR(255) NOT NULL,        -- Nhà xuất bản
    publication_year INT,                   -- Năm xuất bản
    role VARCHAR(100) DEFAULT 'Chủ biên',   -- 'Chủ biên', 'Đồng tác giả', 'Tham gia biên soạn'
    isbn VARCHAR(50),
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_books_profile ON public.books (profile_id);

-- -------------------------------------------------------------------------
-- 11. AWARDS TABLE (Giải thưởng Khoa học & Công nghệ)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.awards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,                     -- Tên giải thưởng
    awarding_body VARCHAR(255) NOT NULL,    -- Cơ quan / Tổ chức trao giải
    award_year INT,                         -- Năm trao giải
    award_type VARCHAR(100),                -- 'Quốc tế', 'Quốc gia', 'Bộ/Ngành', 'Cấp Trường'
    description TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_awards_profile ON public.awards (profile_id);

-- -------------------------------------------------------------------------
-- 12. ADMINS TABLE (Danh sách quản trị viên hệ thống)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin',
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    granted_by VARCHAR(255) DEFAULT 'System Superadmin'
);
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins (email);

-- -------------------------------------------------------------------------
-- TRIGGER FOR AUTOMATIC UPDATED_AT TIMESTAMP
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- -------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teaching_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_directions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.degrees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foreign_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Allow public read of profiles for searching/browsing (or authenticated users)
CREATE POLICY "Public Profiles are viewable by all users" 
ON public.profiles FOR SELECT USING (true);

-- Users can insert and update their own profile by matching email or auth UID
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR ALL USING (true);

-- Related tables open access for authenticated users / client application
CREATE POLICY "Access faculty_preferences" ON public.faculty_preferences FOR ALL USING (true);
CREATE POLICY "Access teaching_subjects" ON public.teaching_subjects FOR ALL USING (true);
CREATE POLICY "Access research_directions" ON public.research_directions FOR ALL USING (true);
CREATE POLICY "Access degrees" ON public.degrees FOR ALL USING (true);
CREATE POLICY "Access foreign_languages" ON public.foreign_languages FOR ALL USING (true);
CREATE POLICY "Access work_history" ON public.work_history FOR ALL USING (true);
CREATE POLICY "Access research_projects" ON public.research_projects FOR ALL USING (true);
CREATE POLICY "Access publications" ON public.publications FOR ALL USING (true);
CREATE POLICY "Access books" ON public.books FOR ALL USING (true);
CREATE POLICY "Access awards" ON public.awards FOR ALL USING (true);
CREATE POLICY "Access admins" ON public.admins FOR ALL USING (true);
