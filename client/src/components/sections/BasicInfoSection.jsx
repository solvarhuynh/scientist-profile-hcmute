import React from 'react';
import { useProfile } from '../../context/ProfileContext';
import { User, Phone, MapPin, Award, Building, CreditCard } from 'lucide-react';

export default function BasicInfoSection() {
  const { profile, updateProfileField } = useProfile();

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateProfileField(name, value);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">I. Lý Lịch Sơ Lược & Thông Tin Cơ Bản</h2>
            <p className="text-xs text-slate-500">Thông tin cá nhân, định danh, chức danh và thông tin liên hệ chính thức</p>
          </div>
        </div>

        {/* Form Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Full Name */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Họ và tên <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="full_name"
              value={profile.full_name || ''}
              onChange={handleChange}
              placeholder="VD: NGUYỄN VĂN AN"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 font-semibold"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Giới tính
            </label>
            <select
              name="gender"
              value={profile.gender || 'Nam'}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          {/* DOB */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Ngày, tháng, năm sinh
            </label>
            <input
              type="date"
              name="dob"
              value={profile.dob || ''}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* POB */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nơi sinh
            </label>
            <input
              type="text"
              name="pob"
              value={profile.pob || ''}
              onChange={handleChange}
              placeholder="VD: TP. Hồ Chí Minh"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Hometown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Quê quán
            </label>
            <input
              type="text"
              name="hometown"
              value={profile.hometown || ''}
              onChange={handleChange}
              placeholder="VD: Bến Tre"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Ethnicity */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Dân tộc
            </label>
            <input
              type="text"
              name="ethnicity"
              value={profile.ethnicity || 'Kinh'}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Highest Degree */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Học vị cao nhất
            </label>
            <input
              type="text"
              name="highest_degree"
              value={profile.highest_degree || ''}
              onChange={handleChange}
              placeholder="VD: Tiến sĩ / Thạc sĩ"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Degree Year & Country */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Năm nhận học vị
            </label>
            <input
              type="number"
              name="degree_conferred_year"
              value={profile.degree_conferred_year || ''}
              onChange={handleChange}
              placeholder="VD: 2006"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nước nhận học vị
            </label>
            <input
              type="text"
              name="degree_country"
              value={profile.degree_country || ''}
              onChange={handleChange}
              placeholder="VD: Nhật Bản / Việt Nam"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Academic Title (GS/PGS) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Chức danh khoa học cao nhất
            </label>
            <select
              name="academic_title"
              value={profile.academic_title || ''}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
            >
              <option value="">-- Không có / Chưa bổ nhiệm --</option>
              <option value="Giáo sư">Giáo sư</option>
              <option value="Phó Giáo sư">Phó Giáo sư</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Năm bổ nhiệm chức danh
            </label>
            <input
              type="number"
              name="title_appointed_year"
              value={profile.title_appointed_year || ''}
              onChange={handleChange}
              placeholder="VD: 2018"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Position & Department */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Chức vụ hiện tại
            </label>
            <input
              type="text"
              name="position"
              value={profile.position || ''}
              onChange={handleChange}
              placeholder="VD: Trưởng Khoa / Giảng viên"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Đơn vị công tác
            </label>
            <input
              type="text"
              name="department"
              value={profile.department || ''}
              onChange={handleChange}
              placeholder="VD: Khoa Công Nghệ Thông Tin - ĐH Sư Phạm Kỹ Thuật TP.HCM"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Address */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Chỗ ở riêng hoặc địa chỉ liên lạc
            </label>
            <input
              type="text"
              name="address"
              value={profile.address || ''}
              onChange={handleChange}
              placeholder="VD: Số 01 Võ Văn Ngân, Phường Linh Chiểu, TP. Thủ Đức, TP.HCM"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Phone Numbers */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Điện thoại di động (DĐ)
            </label>
            <input
              type="text"
              name="mobile_phone"
              value={profile.mobile_phone || ''}
              onChange={handleChange}
              placeholder="VD: 0903123456"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Điện thoại cơ quan (CQ)
            </label>
            <input
              type="text"
              name="office_phone"
              value={profile.office_phone || ''}
              onChange={handleChange}
              placeholder="VD: 02838968641"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email liên hệ
            </label>
            <input
              type="email"
              name="email"
              value={profile.email || ''}
              onChange={handleChange}
              placeholder="VD: annv@hcmute.edu.vn"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* CCCD Identification */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Số CCCD / Hộ chiếu
            </label>
            <input
              type="text"
              name="cccd"
              value={profile.cccd || ''}
              onChange={handleChange}
              placeholder="VD: 079075001234"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Ngày cấp CCCD
            </label>
            <input
              type="date"
              name="cccd_date"
              value={profile.cccd_date || ''}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nơi cấp CCCD
            </label>
            <input
              type="text"
              name="cccd_place"
              value={profile.cccd_place || ''}
              onChange={handleChange}
              placeholder="VD: Cục CSQLHC về TTXH"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
            />
          </div>

        </div>
      </div>
    </div>
  );
}

