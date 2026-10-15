import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { Award, Plus, Trash2, Edit2 } from 'lucide-react';

export default function AwardsSection() {
  const { profile, updateProfileField } = useProfile();

  const [form, setForm] = useState({
    name: '',
    awarding_body: '',
    award_year: '',
    award_type: 'Quốc gia',
    description: ''
  });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.awarding_body.trim()) {
      alert('Vui lòng nhập tên giải thưởng và cơ quan trao giải');
      return;
    }

    const current = profile.awards || [];
    if (editingId) {
      const updated = current.map(a => a.id === editingId ? { ...form, id: editingId } : a);
      updateProfileField('awards', updated);
      setEditingId(null);
    } else {
      const newItem = {
        ...form,
        id: 'aw-' + Date.now(),
        award_year: form.award_year ? parseInt(form.award_year) : null
      };
      updateProfileField('awards', [...current, newItem]);
    }

    setForm({
      name: '',
      awarding_body: '',
      award_year: '',
      award_type: 'Quốc gia',
      description: ''
    });
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name || '',
      awarding_body: item.awarding_body || '',
      award_year: item.award_year || '',
      award_type: item.award_type || 'Quốc gia',
      description: item.description || ''
    });
  };

  const handleRemove = (id) => {
    const updated = (profile.awards || []).filter(a => a.id !== id);
    updateProfileField('awards', updated);
    if (editingId === id) setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">VII. Khen Thưởng & Giải Thưởng Khoa Học</h2>
              <p className="text-xs text-slate-500">Các huân huy chương, danh hiệu nhà giáo và giải thưởng KH&CN các cấp</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">
            {profile.awards?.length || 0} giải thưởng
          </span>
        </div>

        {/* Input Form */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            {editingId ? 'Chỉnh sửa giải thưởng' : 'Thêm giải thưởng KH&CN mới'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Tên giải thưởng / Khen thưởng <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="VD: Giải thưởng Khoa học Công nghệ Quả Cầu Vàng"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Cơ quan / Tổ chức trao giải <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="awarding_body"
                value={form.awarding_body}
                onChange={handleChange}
                placeholder="VD: Bộ KH&CN và TW Đoàn TNCS Hồ Chí Minh"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Cấp khen thưởng</label>
              <select
                name="award_type"
                value={form.award_type}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
              >
                <option value="Quốc tế">Quốc tế</option>
                <option value="Quốc gia">Cấp Quốc gia</option>
                <option value="Bộ/Ngành">Cấp Bộ / Ngành</option>
                <option value="Tỉnh/Thành phố">Cấp Tỉnh / TP</option>
                <option value="Cấp Trường">Cấp Trường</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Năm trao giải</label>
              <input
                type="number"
                name="award_year"
                value={form.award_year}
                onChange={handleChange}
                placeholder="VD: 2020"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Mô tả chi tiết / Thành tích</label>
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="VD: Khen thưởng công trình nghiên cứu xuất sắc trong lĩnh vực CNTT"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
              />
            </div>
          </div>

          <div className="mt-3 flex justify-end space-x-2">
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: '', awarding_body: '', award_year: '', award_type: 'Quốc gia', description: '' });
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Hủy
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-blue-700/20"
            >
              <Plus className="w-3.5 h-3.5" />
              {editingId ? 'Cập nhật giải thưởng' : 'Thêm giải thưởng'}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50/50">
                <th className="py-2.5 px-3">TT</th>
                <th className="py-2.5 px-3">Tên giải thưởng</th>
                <th className="py-2.5 px-3">Cơ quan trao giải</th>
                <th className="py-2.5 px-3">Năm & Cấp</th>
                <th className="py-2.5 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {(profile.awards || []).map((aw, idx) => (
                <tr key={aw.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3 font-bold text-slate-400">{idx + 1}</td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-800">{aw.name}</div>
                    {aw.description && <div className="text-[11px] text-slate-500">{aw.description}</div>}
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-medium">{aw.awarding_body}</td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-800">{aw.award_year || '—'}</div>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700">
                      {aw.award_type || 'Quốc gia'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEdit(aw)}
                      className="p-1 text-slate-400 hover:text-blue-600 transition"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(aw.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition"
                      title="Xóa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {(!profile.awards || profile.awards.length === 0) && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-xs text-slate-400 italic">
                    Chưa có giải thưởng hoặc khen thưởng nào được ghi nhận
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
