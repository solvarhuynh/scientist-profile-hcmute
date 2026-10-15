import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { GraduationCap, Languages, Plus, Trash2, Edit2 } from 'lucide-react';

export default function EducationSection() {
  const { profile, updateProfileField } = useProfile();

  // Degree form state
  const [degreeForm, setDegreeForm] = useState({
    bac_hoc: 'Đại học',
    he_dao_tao: 'Chính quy',
    nganh: '',
    noi_dao_tao: '',
    nuoc_dao_tao: 'Việt Nam',
    nam_tot_nghiep: '',
    ten_de_tai_luan_van: ''
  });
  const [editingDegreeId, setEditingDegreeId] = useState(null);

  // Language form state
  const [languageForm, setLanguageForm] = useState({
    language_name: '',
    proficiency_level: 'Thành thạo'
  });

  // Degree Handlers
  const handleDegreeChange = (e) => {
    const { name, value } = e.target;
    setDegreeForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveDegree = () => {
    if (!degreeForm.nganh.trim() || !degreeForm.noi_dao_tao.trim()) {
      alert('Vui lòng nhập ngành học và nơi đào tạo');
      return;
    }

    const current = profile.degrees || [];
    if (editingDegreeId) {
      const updated = current.map(d => d.id === editingDegreeId ? { ...degreeForm, id: editingDegreeId } : d);
      updateProfileField('degrees', updated);
      setEditingDegreeId(null);
    } else {
      const newDegree = {
        ...degreeForm,
        id: 'deg-' + Date.now(),
        nam_tot_nghiep: degreeForm.nam_tot_nghiep ? parseInt(degreeForm.nam_tot_nghiep) : null
      };
      updateProfileField('degrees', [...current, newDegree]);
    }

    // Reset
    setDegreeForm({
      bac_hoc: 'Đại học',
      he_dao_tao: 'Chính quy',
      nganh: '',
      noi_dao_tao: '',
      nuoc_dao_tao: 'Việt Nam',
      nam_tot_nghiep: '',
      ten_de_tai_luan_van: ''
    });
  };

  const handleEditDegree = (deg) => {
    setEditingDegreeId(deg.id);
    setDegreeForm({
      bac_hoc: deg.bac_hoc || 'Đại học',
      he_dao_tao: deg.he_dao_tao || 'Chính quy',
      nganh: deg.nganh || '',
      noi_dao_tao: deg.noi_dao_tao || '',
      nuoc_dao_tao: deg.nuoc_dao_tao || 'Việt Nam',
      nam_tot_nghiep: deg.nam_tot_nghiep || '',
      ten_de_tai_luan_van: deg.ten_de_tai_luan_van || ''
    });
  };

  const handleRemoveDegree = (id) => {
    const updated = (profile.degrees || []).filter(d => d.id !== id);
    updateProfileField('degrees', updated);
    if (editingDegreeId === id) {
      setEditingDegreeId(null);
    }
  };

  // Language Handlers
  const handleAddLanguage = () => {
    if (!languageForm.language_name.trim()) return;
    const current = profile.foreign_languages || [];
    const updated = [
      ...current,
      {
        id: 'fl-' + Date.now(),
        language_name: languageForm.language_name.trim(),
        proficiency_level: languageForm.proficiency_level
      }
    ];
    updateProfileField('foreign_languages', updated);
    setLanguageForm({ language_name: '', proficiency_level: 'Thành thạo' });
  };

  const handleRemoveLanguage = (id) => {
    const updated = (profile.foreign_languages || []).filter(l => l.id !== id);
    updateProfileField('foreign_languages', updated);
  };

  return (
    <div className="space-y-6">
      {/* 1. Degrees & Qualifications */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">III. Quá Trình Đào Tạo</h2>
              <p className="text-xs text-slate-500">Bậc Đại học, Thạc sĩ, Tiến sĩ với Hệ đào tạo và Tên đề tài/luận văn độc lập</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">
            {profile.degrees?.length || 0} văn bằng
          </span>
        </div>

        {/* Form Input for Degree */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            {editingDegreeId ? 'Chỉnh sửa văn bằng' : 'Thêm văn bằng đào tạo mới'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Bậc học */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Bậc đào tạo</label>
              <select
                name="bac_hoc"
                value={degreeForm.bac_hoc}
                onChange={handleDegreeChange}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
              >
                <option value="Đại học">Đại học (Cử nhân / Kỹ sư)</option>
                <option value="Thạc sĩ">Thạc sĩ</option>
                <option value="Tiến sĩ">Tiến sĩ (PhD)</option>
                <option value="Sau đại học">Sau đại học (Khác)</option>
              </select>
            </div>

            {/* Hệ đào tạo (Dedicated Field as requested) */}
            <div>
              <label className="block text-[11px] font-bold text-blue-700 mb-1">
                Hệ đào tạo <span className="text-rose-500">*</span>
              </label>
              <select
                name="he_dao_tao"
                value={degreeForm.he_dao_tao}
                onChange={handleDegreeChange}
                className="w-full px-3 py-2 text-xs rounded-lg border border-blue-300 focus:outline-none focus:border-blue-600 bg-blue-50/30 font-semibold text-slate-800"
              >
                <option value="Chính quy">Chính quy</option>
                <option value="Văn bằng 2">Văn bằng 2</option>
                <option value="Từ xa">Từ xa</option>
                <option value="Vừa làm vừa học">Vừa làm vừa học</option>
                <option value="Chất lượng cao">Chất lượng cao</option>
                <option value="Liên thông">Liên thông</option>
              </select>
            </div>

            {/* Ngành học */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Ngành học</label>
              <input
                type="text"
                name="nganh"
                value={degreeForm.nganh}
                onChange={handleDegreeChange}
                placeholder="VD: Công nghệ thông tin"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
              />
            </div>

            {/* Nơi đào tạo */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Nơi đào tạo</label>
              <input
                type="text"
                name="noi_dao_tao"
                value={degreeForm.noi_dao_tao}
                onChange={handleDegreeChange}
                placeholder="VD: Trường ĐH Bách Khoa"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
              />
            </div>

            {/* Nước đào tạo */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Nước đào tạo</label>
              <input
                type="text"
                name="nuoc_dao_tao"
                value={degreeForm.nuoc_dao_tao}
                onChange={handleDegreeChange}
                placeholder="VD: Việt Nam, Nhật Bản..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
              />
            </div>

            {/* Năm tốt nghiệp */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Năm tốt nghiệp</label>
              <input
                type="number"
                name="nam_tot_nghiep"
                value={degreeForm.nam_tot_nghiep}
                onChange={handleDegreeChange}
                placeholder="VD: 2006"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
              />
            </div>

            {/* Tên đề tài tốt nghiệp / Luận văn / Luận án (Dedicated Field) */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-blue-700 mb-1">
                Tên đồ án tốt nghiệp / Luận văn / Luận án
              </label>
              <input
                type="text"
                name="ten_de_tai_luan_van"
                value={degreeForm.ten_de_tai_luan_van}
                onChange={handleDegreeChange}
                placeholder="VD: Thiết kế hệ thống mạng phân tán dựa trên giao thức IoT..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-blue-300 focus:outline-none focus:border-blue-600 bg-blue-50/30"
              />
            </div>
          </div>

          <div className="mt-3 flex justify-end space-x-2">
            {editingDegreeId && (
              <button
                type="button"
                onClick={() => {
                  setEditingDegreeId(null);
                  setDegreeForm({
                    bac_hoc: 'Đại học',
                    he_dao_tao: 'Chính quy',
                    nganh: '',
                    noi_dao_tao: '',
                    nuoc_dao_tao: 'Việt Nam',
                    nam_tot_nghiep: '',
                    ten_de_tai_luan_van: ''
                  });
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Hủy
              </button>
            )}
            <button
              type="button"
              onClick={handleSaveDegree}
              className="px-4 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-blue-700/20"
            >
              <Plus className="w-3.5 h-3.5" />
              {editingDegreeId ? 'Cập nhật văn bằng' : 'Thêm vào danh sách'}
            </button>
          </div>
        </div>

        {/* Table of Degrees */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50/50">
                <th className="py-2.5 px-3">Bậc học</th>
                <th className="py-2.5 px-3">Hệ đào tạo</th>
                <th className="py-2.5 px-3">Ngành & Trường</th>
                <th className="py-2.5 px-3">Năm / Nước</th>
                <th className="py-2.5 px-3">Đồ án / Luận văn</th>
                <th className="py-2.5 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {(profile.degrees || []).map((deg) => (
                <tr key={deg.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3 font-bold text-slate-800">{deg.bac_hoc}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                      {deg.he_dao_tao || 'Chính quy'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-800">{deg.nganh}</div>
                    <div className="text-[11px] text-slate-500">{deg.noi_dao_tao}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-slate-700">{deg.nam_tot_nghiep || '—'}</span>
                    <span className="text-slate-400 text-[11px]"> ({deg.nuoc_dao_tao || 'Việt Nam'})</span>
                  </td>
                  <td className="py-3 px-3 max-w-xs truncate text-slate-600 italic">
                    {deg.ten_de_tai_luan_van || '—'}
                  </td>
                  <td className="py-3 px-3 text-right space-x-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEditDegree(deg)}
                      className="p-1 text-slate-400 hover:text-blue-600 transition"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveDegree(deg.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition"
                      title="Xóa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {(!profile.degrees || profile.degrees.length === 0) && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-xs text-slate-400 italic">
                    Chưa có văn bằng đào tạo nào trong hồ sơ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Foreign Languages */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-sky-50 text-sky-700 rounded-xl">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Trình Độ Ngoại Ngữ</h3>
              <p className="text-xs text-slate-500">Các ngôn ngữ và mức độ sử dụng trong giảng dạy & nghiên cứu</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-sky-50 text-sky-700 rounded-full">
            {profile.foreign_languages?.length || 0} ngôn ngữ
          </span>
        </div>

        {/* Input Add */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-2">
          <div className="sm:col-span-5">
            <input
              type="text"
              placeholder="Tên ngoại ngữ (VD: Tiếng Anh, Tiếng Pháp...)"
              value={languageForm.language_name}
              onChange={e => setLanguageForm(prev => ({ ...prev, language_name: e.target.value }))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-600"
            />
          </div>
          <div className="sm:col-span-5">
            <input
              type="text"
              placeholder="Mức độ sử dụng (VD: Thành thạo (IELTS 7.5), Giao tiếp tốt...)"
              value={languageForm.proficiency_level}
              onChange={e => setLanguageForm(prev => ({ ...prev, proficiency_level: e.target.value }))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-600"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={handleAddLanguage}
              className="w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm
            </button>
          </div>
        </div>

        {/* Language List */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(profile.foreign_languages || []).map((fl) => (
            <div key={fl.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <div className="text-xs font-bold text-slate-800">{fl.language_name}</div>
                <div className="text-[11px] text-slate-500 font-medium">Mức độ: {fl.proficiency_level}</div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveLanguage(fl.id)}
                className="text-slate-400 hover:text-rose-600 p-1 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {(!profile.foreign_languages || profile.foreign_languages.length === 0) && (
            <div className="sm:col-span-2 text-center py-4 text-xs text-slate-400 italic">
              Chưa có ngoại ngữ nào được thêm
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
