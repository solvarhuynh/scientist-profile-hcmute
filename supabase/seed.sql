-- =========================================================================
-- HCMUTE SCIENTIFIC CV & FACULTY MANAGEMENT SYSTEM
-- Seed Data for Supabase
-- =========================================================================

-- 1. Insert Initial Admins
INSERT INTO public.admins (email, full_name, role, granted_by)
VALUES 
    ('admin@hcmute.edu.vn', 'Quản Trị Viên Hệ Thống HCMUTE', 'superadmin', 'System Initializer'),
    ('khoacntt@hcmute.edu.vn', 'Ban Chủ Nhiệm Khoa CNTT', 'admin', 'admin@hcmute.edu.vn'),
    ('phongkhcn@hcmute.edu.vn', 'Phòng Khoa Học Công Nghệ', 'admin', 'admin@hcmute.edu.vn')
ON CONFLICT (email) DO NOTHING;

-- 2. Insert Demo Scientist Profiles
-- Profile 1: GS.TS. Nguyễn Văn An
INSERT INTO public.profiles (
    id, email, full_name, gender, dob, pob, hometown, ethnicity,
    academic_title, title_appointed_year, highest_degree, degree_conferred_year, degree_country,
    position, department, address, office_phone, home_phone, mobile_phone, cccd, cccd_date, cccd_place, role
) VALUES (
    'a1111111-1111-1111-1111-111111111111',
    'annv@hcmute.edu.vn',
    'Nguyễn Văn An',
    'Nam',
    '1975-08-15',
    'TP. Hồ Chí Minh',
    'Bến Tre',
    'Kinh',
    'Giáo sư',
    2018,
    'Tiến sĩ',
    2006,
    'Nhật Bản',
    'Trưởng Khoa',
    'Khoa Công Nghệ Thông Tin - ĐH Sư Phạm Kỹ Thuật TP.HCM',
    '01 Võ Văn Ngân, Phường Linh Chiểu, TP. Thủ Đức, TP. Hồ Chí Minh',
    '02838968641',
    '02837221223',
    '0903123456',
    '079075001234',
    '2021-05-10',
    'Cục CSQLHC về TTXH',
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- Preferences for Profile 1
INSERT INTO public.faculty_preferences (profile_id, thinh_giang, nghien_cuu, hoi_dong, huong_dan, doanh_nghiep, ghi_chu)
VALUES ('a1111111-1111-1111-1111-111111111111', true, true, true, true, true, 'Sẵn sàng tham gia hội đồng chấm luận án và hợp tác R&D doanh nghiệp AI.')
ON CONFLICT (profile_id) DO NOTHING;

-- Teaching subjects
INSERT INTO public.teaching_subjects (profile_id, major, name, description)
VALUES 
    ('a1111111-1111-1111-1111-111111111111', 'Khoa học máy tính', 'Trí tuệ nhân tạo nâng cao', 'Học phần cao học và nghiên cứu sinh'),
    ('a1111111-1111-1111-1111-111111111111', 'Kỹ thuật phần mềm', 'Kiến trúc phần mềm phân tán', 'Học phần đại học chính quy chất lượng cao');

-- Research directions
INSERT INTO public.research_directions (profile_id, major, name, description)
VALUES 
    ('a1111111-1111-1111-1111-111111111111', 'Trí tuệ nhân tạo', 'Học sâu & Thị giác máy tính', 'Ứng dụng trong y tế thông minh và giao thông thông minh'),
    ('a1111111-1111-1111-1111-111111111111', 'Khoa học dữ liệu', 'Phân tích dữ liệu lớn', 'Big Data Analytics cho quản trị đô thị thông minh');

-- Degrees (Notice: he_dao_tao separated cleanly from ten_de_tai_luan_van)
INSERT INTO public.degrees (profile_id, bac_hoc, he_dao_tao, nganh, noi_dao_tao, nuoc_dao_tao, nam_tot_nghiep, ten_de_tai_luan_van, order_index)
VALUES 
    ('a1111111-1111-1111-1111-111111111111', 'Đại học', 'Chính quy', 'Công nghệ thông tin', 'Trường ĐH Bách Khoa - ĐHQG TP.HCM', 'Việt Nam', 1997, 'Hệ thống quản lý thông tin trường đại học trên nền tảng Web', 1),
    ('a1111111-1111-1111-1111-111111111111', 'Thạc sĩ', 'Chính quy', 'Khoa học máy tính', 'Viện Công nghệ Tokyo (Tokyo Tech)', 'Nhật Bản', 2002, 'Efficient Algorithms for Image Segmentation in Medical Diagnostics', 2),
    ('a1111111-1111-1111-1111-111111111111', 'Tiến sĩ', 'Chính quy', 'Khoa học máy tính', 'Viện Công nghệ Tokyo (Tokyo Tech)', 'Nhật Bản', 2006, 'Deep Neural Networks for High-Dimensional Computer Vision Processing', 3);

-- Foreign Languages
INSERT INTO public.foreign_languages (profile_id, language_name, proficiency_level)
VALUES 
    ('a1111111-1111-1111-1111-111111111111', 'Tiếng Anh', 'Thành thạo (C2 / IELTS 8.0)'),
    ('a1111111-1111-1111-1111-111111111111', 'Tiếng Nhật', 'Giao tiếp tốt (JLPT N2)');

-- Work History
INSERT INTO public.work_history (profile_id, from_date, to_date, is_current, workplace, position, description, order_index)
VALUES 
    ('a1111111-1111-1111-1111-111111111111', '09/1997', '12/2000', false, 'Trường ĐH Sư Phạm Kỹ Thuật TP.HCM', 'Giảng viên tập sự - Bộ môn Tin học', 'Giảng dạy lập trình căn bản', 1),
    ('a1111111-1111-1111-1111-111111111111', '01/2001', '09/2006', false, 'Tokyo Institute of Technology', 'Nghiên cứu sinh & Trợ lý nghiên cứu', 'Nghiên cứu phòng Lab AI', 2),
    ('a1111111-1111-1111-1111-111111111111', '10/2006', 'Hiện tại', true, 'Trường ĐH Sư Phạm Kỹ Thuật TP.HCM', 'Trưởng Khoa CNTT, Giảng viên cao cấp', 'Chủ trì giảng dạy và định hướng nghiên cứu khoa học', 3);

-- Research Projects
INSERT INTO public.research_projects (profile_id, name, project_level, start_year, end_year, role, status, rating, funding, order_index)
VALUES 
    ('a1111111-1111-1111-1111-111111111111', 'Nghiên cứu ứng dụng Deep Learning trong nhận dạng tổn thương phổi qua ảnh chụp X-quang và CT', 'Bộ', '2020', '2022', 'Chủ nhiệm', 'Đã nghiệm thu', 'Xuất sắc', 850000000, 1),
    ('a1111111-1111-1111-1111-111111111111', 'Xây dựng nền tảng thông minh phân luồng giao thông đô thị bằng Camera AI', 'Tỉnh/Thành phố', '2022', '2024', 'Chủ nhiệm', 'Đã nghiệm thu', 'Xuất sắc', 1200000000, 2);

-- Publications
INSERT INTO public.publications (profile_id, title, authors, journal_name, publication_year, volume_issue, index_type, doi_url, order_index)
VALUES 
    ('a1111111-1111-1111-1111-111111111111', 'Deep Vision Transformer for Real-Time Medical Image Classification', 'Nguyen Van An, Tran Minh Chau, John Doe', 'IEEE Transactions on Pattern Analysis and Machine Intelligence', 2023, 'Vol. 45, No. 3, pp. 2100-2115', 'ISI/Scopus', 'https://doi.org/10.1109/TPAMI.2023.100234', 1),
    ('a1111111-1111-1111-1111-111111111111', 'An Efficient Edge AI Framework for Intelligent Transportation Systems', 'Nguyen Van An, Le Thi Bich', 'Journal of Science and Technology - HCMUTE', 2022, 'Vol. 68, No. 4, pp. 45-56', 'Trong nước', 'https://doi.org/10.54644/jte.hcmute.2022.45', 2);

-- Books
INSERT INTO public.books (profile_id, title, publisher, publication_year, role, isbn, order_index)
VALUES 
    ('a1111111-1111-1111-1111-111111111111', 'Giáo trình Trí tuệ Nhân tạo Hiện đại và Học sâu', 'NXB Đại học Quốc gia TP.HCM', 2021, 'Chủ biên', '978-604-73-8201-1', 1),
    ('a1111111-1111-1111-1111-111111111111', 'Nhập môn Xử lý ảnh số và Thị giác máy tính', 'NXB Khoa học và Kỹ thuật', 2019, 'Chủ biên', '978-604-67-1234-8', 2);

-- Awards
INSERT INTO public.awards (profile_id, name, awarding_body, award_year, award_type, description, order_index)
VALUES 
    ('a1111111-1111-1111-1111-111111111111', 'Giải thưởng Khoa học Công nghệ Quả Cầu Vàng', 'Bộ KH&CN và TW Đoàn TNCS Hồ Chí Minh', 2015, 'Quốc gia', 'Khen thưởng công trình nghiên cứu xuất sắc trong lĩnh vực CNTT', 1),
    ('a1111111-1111-1111-1111-111111111111', 'Nhà giáo Ưu tú', 'Chủ tịch nước CHXHCN Việt Nam', 2020, 'Quốc gia', 'Tặng thưởng vì những cống hiến xuất sắc cho sự nghiệp giáo dục', 2);

-- Profile 2: PGS.TS. Trần Thị Mai
INSERT INTO public.profiles (
    id, email, full_name, gender, dob, pob, hometown, ethnicity,
    academic_title, title_appointed_year, highest_degree, degree_conferred_year, degree_country,
    position, department, address, office_phone, home_phone, mobile_phone, cccd, cccd_date, cccd_place, role
) VALUES (
    'b2222222-2222-2222-2222-222222222222',
    'maitt@hcmute.edu.vn',
    'Trần Thị Mai',
    'Nữ',
    '1982-11-20',
    'Hà Nội',
    'Nam Định',
    'Kinh',
    'Phó Giáo sư',
    2021,
    'Tiến sĩ',
    2012,
    'Pháp',
    'Phó Trưởng Khoa',
    'Khoa Điện - Điện Tử - ĐH Sư Phạm Kỹ Thuật TP.HCM',
    'Số 12 đường số 8, Phường Tăng Nhơn Phú B, TP. Thủ Đức, TP.HCM',
    '02838961234',
    '',
    '0918889999',
    '001182005678',
    '2022-03-15',
    'Cục CSQLHC về TTXH',
    'user'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO public.faculty_preferences (profile_id, thinh_giang, nghien_cuu, hoi_dong, huong_dan, doanh_nghiep, ghi_chu)
VALUES ('b2222222-2222-2222-2222-222222222222', true, true, true, true, false, 'Hợp tác nghiên cứu về Vi mạch bán dẫn và Hệ thống nhúng IoT.')
ON CONFLICT (profile_id) DO NOTHING;

INSERT INTO public.degrees (profile_id, bac_hoc, he_dao_tao, nganh, noi_dao_tao, nuoc_dao_tao, nam_tot_nghiep, ten_de_tai_luan_van, order_index)
VALUES 
    ('b2222222-2222-2222-2222-222222222222', 'Đại học', 'Chính quy', 'Kỹ thuật Điện tử - Viễn thông', 'Trường ĐH Bách Khoa Hà Nội', 'Việt Nam', 2004, 'Thiết kế bộ lọc số thích nghi trên vi xử lý DSP', 1),
    ('b2222222-2222-2222-2222-222222222222', 'Thạc sĩ', 'Chính quy', 'Điện tử và Vi mạch', 'Grenoble INP', 'Pháp', 2007, 'Low-Power CMOS Analog Circuit Design', 2),
    ('b2222222-2222-2222-2222-222222222222', 'Tiến sĩ', 'Chính quy', 'Kỹ thuật Vi điện tử', 'Sorbonne Université', 'Pháp', 2012, 'Ultra-Low Voltage RF Energy Harvesting for IoT Sensor Nodes', 3);
