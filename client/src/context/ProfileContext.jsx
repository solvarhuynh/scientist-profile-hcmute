import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const ProfileContext = createContext(null);

const initialProfile = {
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
  email: 'annv@hcmute.edu.vn',
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
    { id: 'aw-1', name: 'Giải thưởng Khoa học Công nghệ Quả Cầu Vàng', awarding_body: 'Bộ KH&CN và TW Đoàn TNCS Hồ Chí Minh', award_year: 2015, award_type: 'Quốc gia', description: 'Khen thưởng công trình nghiên cứu xuất sắc trong lĩnh vực CNTT' },
    { id: 'aw-2', name: 'Nhà giáo Ưu tú', awarding_body: 'Chủ tịch nước CHXHCN Việt Nam', award_year: 2020, award_type: 'Quốc gia', description: 'Tặng thưởng vì những cống hiến xuất sắc cho sự nghiệp giáo dục' }
  ]
};

export function ProfileProvider({ children }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(initialProfile);
  const [activeSection, setActiveSection] = useState('basic');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (user && user.email) {
      api.getProfile(user.email)
        .then(res => {
          if (res.success && res.profile) {
            setProfile(res.profile);
          }
        })
        .catch(err => console.warn('Could not fetch server profile, using default:', err));
    }
  }, [user]);

  const updateProfileField = (key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const updatePreferences = (key, value) => {
    setProfile(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value }
    }));
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await api.saveProfile(profile);
      showToast('Đã lưu lý lịch khoa học thành công!');
    } catch (err) {
      showToast('Lỗi khi lưu dữ liệu: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const setEntireProfile = (newProfile) => {
    setProfile(newProfile);
    showToast('Đã áp dụng dữ liệu nhập mới thành công!');
  };

  return (
    <ProfileContext.Provider value={{
      profile,
      activeSection,
      setActiveSection,
      updateProfileField,
      updatePreferences,
      setEntireProfile,
      saveProfile,
      saving,
      toast,
      showToast
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
