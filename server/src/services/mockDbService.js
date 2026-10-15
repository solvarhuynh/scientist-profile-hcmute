// In-memory / Mock DB service mimicking Supabase queries
const mockProfiles = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    email: 'annv@hcmute.edu.vn',
    full_name: 'Nguyễn Văn An',
    gender: 'Nam',
    dob: '1975-08-15',
    pob: 'TP. Hồ Chí Minh',
    hometown: 'Bến Tre',
    ethnicity: 'Kinh',
    academic_title: 'Giáo sư',
    title_appointed_year: 2018,
    highest_degree: 'Tiến sĩ',
    degree_conferred_year: 2006,
    degree_country: 'Nhật Bản',
    position: 'Trưởng Khoa',
    department: 'Khoa Công Nghệ Thông Tin - ĐH Sư Phạm Kỹ Thuật TP.HCM',
    address: '01 Võ Văn Ngân, Phường Linh Chiểu, TP. Thủ Đức, TP. Hồ Chí Minh',
    office_phone: '02838968641',
    home_phone: '02837221223',
    mobile_phone: '0903123456',
    fax: '',
    cccd: '079075001234',
    cccd_date: '2021-05-10',
    cccd_place: 'Cục CSQLHC về TTXH',
    role: 'admin',
    preferences: {
      thinh_giang: true,
      nghien_cuu: true,
      hoi_dong: true,
      huong_dan: true,
      doanh_nghiep: true,
      ghi_chu: 'Sẵn sàng tham gia hội đồng chấm luận án và hợp tác R&D doanh nghiệp AI.'
    },
    teaching_subjects: [
      { id: 'ts-1', major: 'Khoa học máy tính', name: 'Trí tuệ nhân tạo nâng cao', description: 'Học phần cao học và nghiên cứu sinh' },
      { id: 'ts-2', major: 'Kỹ thuật phần mềm', name: 'Kiến trúc phần mềm phân tán', description: 'Học phần đại học chính quy chất lượng cao' }
    ],
    research_directions: [
      { id: 'rd-1', major: 'Trí tuệ nhân tạo', name: 'Học sâu & Thị giác máy tính', description: 'Ứng dụng trong y tế thông minh và giao thông thông minh' },
      { id: 'rd-2', major: 'Khoa học dữ liệu', name: 'Phân tích dữ liệu lớn', description: 'Big Data Analytics cho quản trị đô thị thông minh' }
    ],
    degrees: [
      {
        id: 'deg-1',
        bac_hoc: 'Đại học',
        he_dao_tao: 'Chính quy',
        nganh: 'Công nghệ thông tin',
        noi_dao_tao: 'Trường ĐH Bách Khoa - ĐHQG TP.HCM',
        nuoc_dao_tao: 'Việt Nam',
        nam_tot_nghiep: 1997,
        ten_de_tai_luan_van: 'Hệ thống quản lý thông tin trường đại học trên nền tảng Web'
      },
      {
        id: 'deg-2',
        bac_hoc: 'Thạc sĩ',
        he_dao_tao: 'Chính quy',
        nganh: 'Khoa học máy tính',
        noi_dao_tao: 'Viện Công nghệ Tokyo (Tokyo Tech)',
        nuoc_dao_tao: 'Nhật Bản',
        nam_tot_nghiep: 2002,
        ten_de_tai_luan_van: 'Efficient Algorithms for Image Segmentation in Medical Diagnostics'
      },
      {
        id: 'deg-3',
        bac_hoc: 'Tiến sĩ',
        he_dao_tao: 'Chính quy',
        nganh: 'Khoa học máy tính',
        noi_dao_tao: 'Viện Công nghệ Tokyo (Tokyo Tech)',
        nuoc_dao_tao: 'Nhật Bản',
        nam_tot_nghiep: 2006,
        ten_de_tai_luan_van: 'Deep Neural Networks for High-Dimensional Computer Vision Processing'
      }
    ],
    foreign_languages: [
      { id: 'fl-1', language_name: 'Tiếng Anh', proficiency_level: 'Thành thạo (C2 / IELTS 8.0)' },
      { id: 'fl-2', language_name: 'Tiếng Nhật', proficiency_level: 'Giao tiếp tốt (JLPT N2)' }
    ],
    work_history: [
      { id: 'wh-1', from_date: '09/1997', to_date: '12/2000', is_current: false, workplace: 'Trường ĐH Sư Phạm Kỹ Thuật TP.HCM', position: 'Giảng viên tập sự - Bộ môn Tin học' },
      { id: 'wh-2', from_date: '01/2001', to_date: '09/2006', is_current: false, workplace: 'Tokyo Institute of Technology', position: 'Nghiên cứu sinh & Trợ lý nghiên cứu' },
      { id: 'wh-3', from_date: '10/2006', to_date: '', is_current: true, workplace: 'Trường ĐH Sư Phạm Kỹ Thuật TP.HCM', position: 'Trưởng Khoa CNTT, Giảng viên cao cấp' }
    ],
    research_projects: [
      { id: 'rp-1', name: 'Nghiên cứu ứng dụng Deep Learning trong nhận dạng tổn thương phổi qua ảnh chụp X-quang và CT', project_level: 'Bộ', start_year: '2020', end_year: '2022', role: 'Chủ nhiệm', status: 'Đã nghiệm thu', rating: 'Xuất sắc', funding: 850000000 },
      { id: 'rp-2', name: 'Xây dựng nền tảng thông minh phân luồng giao thông đô thị bằng Camera AI', project_level: 'Tỉnh/Thành phố', start_year: '2022', end_year: '2024', role: 'Chủ nhiệm', status: 'Đã nghiệm thu', rating: 'Xuất sắc', funding: 1200000000 }
    ],
    publications: [
      { id: 'pub-1', title: 'Deep Vision Transformer for Real-Time Medical Image Classification', authors: 'Nguyen Van An, Tran Minh Chau, John Doe', journal_name: 'IEEE Transactions on Pattern Analysis and Machine Intelligence', publication_year: 2023, volume_issue: 'Vol. 45, No. 3, pp. 2100-2115', index_type: 'ISI/Scopus', doi_url: 'https://doi.org/10.1109/TPAMI.2023.100234' },
      { id: 'pub-2', title: 'An Efficient Edge AI Framework for Intelligent Transportation Systems', authors: 'Nguyen Van An, Le Thi Bich', journal_name: 'Journal of Science and Technology - HCMUTE', publication_year: 2022, volume_issue: 'Vol. 68, No. 4, pp. 45-56', index_type: 'Trong nước', doi_url: 'https://doi.org/10.54644/jte.hcmute.2022.45' }
    ],
    books: [
      { id: 'bk-1', title: 'Giáo trình Trí tuệ Nhân tạo Hiện đại và Học sâu', publisher: 'NXB Đại học Quốc gia TP.HCM', publication_year: 2021, role: 'Chủ biên', isbn: '978-604-73-8201-1' },
      { id: 'bk-2', title: 'Nhập môn Xử lý ảnh số và Thị giác máy tính', publisher: 'NXB Khoa học và Kỹ thuật', publication_year: 2019, role: 'Chủ biên', isbn: '978-604-67-1234-8' }
    ],
    awards: [
      { id: 'aw-1', name: 'Giải thưởng Khoa học Công nghệ Quả Cầu Vàng', awarding_body: 'Bộ KH&CN và TW Đoàn TNCS Hồ Chí Minh', award_year: 2015, award_type: 'Quốc gia', description: 'Khen thưởng công trình nghiên cứu xuất sắc' },
      { id: 'aw-2', name: 'Nhà giáo Ưu tú', awarding_body: 'Chủ tịch nước CHXHCN Việt Nam', award_year: 2020, award_type: 'Quốc gia', description: 'Tặng thưởng cống hiến xuất sắc' }
    ]
  },
  {
    id: 'b2222222-2222-2222-2222-222222222222',
    email: 'maitt@hcmute.edu.vn',
    full_name: 'Trần Thị Mai',
    gender: 'Nữ',
    dob: '1982-11-20',
    pob: 'Hà Nội',
    hometown: 'Nam Định',
    ethnicity: 'Kinh',
    academic_title: 'Phó Giáo sư',
    title_appointed_year: 2021,
    highest_degree: 'Tiến sĩ',
    degree_conferred_year: 2012,
    degree_country: 'Pháp',
    position: 'Phó Trưởng Khoa',
    department: 'Khoa Điện - Điện Tử - ĐH Sư Phạm Kỹ Thuật TP.HCM',
    address: 'Số 12 đường số 8, Phường Tăng Nhơn Phú B, TP. Thủ Đức, TP.HCM',
    office_phone: '02838961234',
    home_phone: '',
    mobile_phone: '0918889999',
    fax: '',
    cccd: '001182005678',
    cccd_date: '2022-03-15',
    cccd_place: 'Cục CSQLHC về TTXH',
    role: 'user',
    preferences: {
      thinh_giang: true,
      nghien_cuu: true,
      hoi_dong: true,
      huong_dan: true,
      doanh_nghiep: false,
      ghi_chu: 'Hợp tác nghiên cứu về Vi mạch bán dẫn và Hệ thống nhúng IoT.'
    },
    teaching_subjects: [
      { id: 'ts-3', major: 'Kỹ thuật Điện tử', name: 'Thiết kế Vi mạch tích hợp CMOS', description: 'Chuyên ngành Điện tử Viễn thông' }
    ],
    research_directions: [
      { id: 'rd-3', major: 'Vi điện tử & Bán dẫn', name: 'IC Design công suất thấp', description: 'Nghiên cứu chip ứng dụng IoT và cảm biến y sinh' }
    ],
    degrees: [
      {
        id: 'deg-4',
        bac_hoc: 'Đại học',
        he_dao_tao: 'Chính quy',
        nganh: 'Kỹ thuật Điện tử - Viễn thông',
        noi_dao_tao: 'Trường ĐH Bách Khoa Hà Nội',
        nuoc_dao_tao: 'Việt Nam',
        nam_tot_nghiep: 2004,
        ten_de_tai_luan_van: 'Thiết kế bộ lọc số thích nghi trên vi xử lý DSP'
      },
      {
        id: 'deg-5',
        bac_hoc: 'Thạc sĩ',
        he_dao_tao: 'Chính quy',
        nganh: 'Điện tử và Vi mạch',
        noi_dao_tao: 'Grenoble INP',
        nuoc_dao_tao: 'Pháp',
        nam_tot_nghiep: 2007,
        ten_de_tai_luan_van: 'Low-Power CMOS Analog Circuit Design'
      },
      {
        id: 'deg-6',
        bac_hoc: 'Tiến sĩ',
        he_dao_tao: 'Chính quy',
        nganh: 'Kỹ thuật Vi điện tử',
        noi_dao_tao: 'Sorbonne Université',
        nuoc_dao_tao: 'Pháp',
        nam_tot_nghiep: 2012,
        ten_de_tai_luan_van: 'Ultra-Low Voltage RF Energy Harvesting for IoT Sensor Nodes'
      }
    ],
    foreign_languages: [
      { id: 'fl-3', language_name: 'Tiếng Anh', proficiency_level: 'Thành thạo (IELTS 7.5)' },
      { id: 'fl-4', language_name: 'Tiếng Pháp', proficiency_level: 'Thành thạo (DALF C1)' }
    ],
    work_history: [
      { id: 'wh-4', from_date: '09/2004', to_date: '08/2006', is_current: false, workplace: 'Viện Công nghệ Thông tin - Viện Hàn lâm KH&CN', position: 'Kỹ sư nghiên cứu' },
      { id: 'wh-5', from_date: '10/2012', to_date: '', is_current: true, workplace: 'Trường ĐH Sư Phạm Kỹ Thuật TP.HCM', position: 'Phó Trưởng Khoa Điện - Điện tử' }
    ],
    research_projects: [
      { id: 'rp-3', name: 'Nghiên cứu thiết kế vi mạch thu thập năng lượng vô tuyến RF cho thiết bị IoT', project_level: 'Bộ', start_year: '2021', end_year: '2023', role: 'Chủ nhiệm', status: 'Đã nghiệm thu', rating: 'Xuất sắc', funding: 700000000 }
    ],
    publications: [
      { id: 'pub-3', title: 'A 0.5V RF Energy Harvesting Circuit in 65nm CMOS for Self-Powered IoT Nodes', authors: 'Tran Thi Mai, Pierre Dubois', journal_name: 'IEEE Journal of Solid-State Circuits', publication_year: 2022, volume_issue: 'Vol. 57, No. 8, pp. 2410-2422', index_type: 'ISI/Scopus', doi_url: 'https://doi.org/10.1109/JSSC.2022.3155890' }
    ],
    books: [],
    awards: [
      { id: 'aw-3', name: 'Giải thưởng Nữ khoa học tiêu biểu L’Oréal - UNESCO Vì sự phát triển phụ nữ trong khoa học', awarding_body: 'UNESCO & Quỹ L’Oréal', award_year: 2021, award_type: 'Quốc tế', description: 'Tôn vinh nhà khoa học nữ xuất sắc' }
    ]
  }
];

const mockAdmins = [
  { id: 'adm-1', email: 'admin@hcmute.edu.vn', full_name: 'Quản Trị Viên Hệ Thống HCMUTE', role: 'superadmin', granted_at: '2025-01-01T00:00:00Z', granted_by: 'System Initializer' },
  { id: 'adm-2', email: 'annv@hcmute.edu.vn', full_name: 'GS.TS. Nguyễn Văn An', role: 'admin', granted_at: '2025-01-05T00:00:00Z', granted_by: 'admin@hcmute.edu.vn' }
];

module.exports = {
  mockProfiles,
  mockAdmins
};

