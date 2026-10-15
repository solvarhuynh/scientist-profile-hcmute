import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { Briefcase, Plus, Trash2, Edit2 } from 'lucide-react';

export default function WorkHistorySection() {
  const { profile, updateProfileField } = useProfile();

  const [form, setForm] = useState({
    from_date: '',
    to_date: '',
    is_current: false,
    workplace: '',
    position: '',
    description: ''
  });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    if (!form.workplace.trim() || !form.position.trim()) {
      alert('Vui lòng nhập đơn vị công tác và chức vụ đảm nhiệm');
      return;
    }

    const current = profile.work_history || [];
    if (editingId) {
      const updated = current.map(item => item.id === editingId ? { ...form, id: editingId } : item);
      updateProfileField('work_history', updated);
      setEditingId(null);
    } else {
      const newItem = {
        ...form,
        id: 'wh-' + Date.now()
      };
      updateProfileField('work_history', [...current, newItem]);
    }

    setForm({
      from_date: '',
      to_date: '',
      is_current: false,
      workplace: '',
      position: '',
      description: ''
    });
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      from_date: item.from_date || '',
      to_date: item.to_date || '',
      is_current: !!item.is_current,
      workplace: item.workplace || '',
      position: item.position || '',
      description: item.description || ''
    });
  };

  const handleRemove = (id) => {
    const updated = (profile.work_history || []).filter(item => item.id !== id);
    updateProfileField('work_history', updated);
    if (editingId === id) setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">IV. Quá Trình Công Tác Chuyên Môn</h2>
              <p className="text-xs text-slate-500">Lịch sử công tác tại các cơ sở giáo dục, viện nghiên cứu và tổ chức doanh nghiệp</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">
            {profile.work_history?.length || 0} giai đoạn
          </span>
        </div>

        {/* Form Input */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            {editingId ? 'Chỉnh sửa quá trình công tác' : 'Thêm quá trình công tác mới'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Thời gian bắt đầu</label>
              <input
                type="text"
                name="from_date"
                value={form.from_date}
                onChange={handleChange}
                placeholder="VD: 09/2012"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Thời gian kết thúc</label>
              <input
                type="text"
                name="to_date"
                value={form.to_date}
                onChange={handleChange}
                disabled={form.is_current}
                placeholder={form.is_current ? 'Hiện tại' : 'VD: 08/2018'}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white disabled:bg-slate-100 disabled:text-slate-400"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_current"
                  checked={form.is_current}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span>Đang công tác tại đây</span>
              </label>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Chức vụ đảm nhiệm</label>
              <input
                type="text"
                name="position"
                value={form.position}
                onChange={handleChange}
                placeholder="VD: Giảng viên cao cấp"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Đơn vị công tác</label>
              <input
                type="text"
                name="workplace"
                value={form.workplace}
                onChange={handleChange}
                placeholder="VD: Trường ĐH Sư Phạm Kỹ Thuật TP.HCM - Khoa Công Nghệ Thông Tin"
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
                  setForm({ from_date: '', to_date: '', is_current: false, workplace: '', position: '', description: '' });
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
              {editingId ? 'Cập nhật' : 'Thêm quá trình'}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50/50">
                <th className="py-2.5 px-3">Thời gian</th>
                <th className="py-2.5 px-3">Đơn vị công tác</th>
                <th className="py-2.5 px-3">Công việc / Chức vụ đảm nhiệm</th>
                <th className="py-2.5 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {(profile.work_history || []).map((item) => {
                const tg = (item.from_date || '') + (item.is_current ? ' - Hiện tại' : (item.to_date ? ' - ' + item.to_date : ''));
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-semibold text-slate-800 whitespace-nowrap">{tg || '—'}</td>
                    <td className="py-3 px-3 font-medium text-slate-700">{item.workplace}</td>
                    <td className="py-3 px-3 text-slate-600">{item.position}</td>
                    <td className="py-3 px-3 text-right space-x-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="p-1 text-slate-400 hover:text-blue-600 transition"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {(!profile.work_history || profile.work_history.length === 0) && (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-xs text-slate-400 italic">
                    Chưa có lịch sử công tác nào được ghi nhận
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
