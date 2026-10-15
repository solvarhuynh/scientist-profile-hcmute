import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { FlaskConical, Plus, Trash2, Edit2 } from 'lucide-react';

export default function ProjectsSection() {
  const { profile, updateProfileField } = useProfile();

  const [form, setForm] = useState({
    name: '',
    project_level: 'Trường',
    start_year: '',
    end_year: '',
    role: 'Chủ nhiệm',
    status: 'Đã nghiệm thu',
    rating: 'Xuất sắc',
    funding: ''
  });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      alert('Vui lòng nhập tên đề tài nghiên cứu');
      return;
    }

    const current = profile.research_projects || [];
    if (editingId) {
      const updated = current.map(item => item.id === editingId ? { ...form, id: editingId } : item);
      updateProfileField('research_projects', updated);
      setEditingId(null);
    } else {
      const newItem = {
        ...form,
        id: 'rp-' + Date.now(),
        funding: form.funding ? parseFloat(form.funding) : null
      };
      updateProfileField('research_projects', [...current, newItem]);
    }

    setForm({
      name: '',
      project_level: 'Trường',
      start_year: '',
      end_year: '',
      role: 'Chủ nhiệm',
      status: 'Đã nghiệm thu',
      rating: 'Xuất sắc',
      funding: ''
    });
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name || '',
      project_level: item.project_level || 'Trường',
      start_year: item.start_year || '',
      end_year: item.end_year || '',
      role: item.role || 'Chủ nhiệm',
      status: item.status || 'Đã nghiệm thu',
      rating: item.rating || '',
      funding: item.funding || ''
    });
  };

  const handleRemove = (id) => {
    const updated = (profile.research_projects || []).filter(item => item.id !== id);
    updateProfileField('research_projects', updated);
    if (editingId === id) setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">V. Đề Tài & Dự Án Nghiên Cứu Khoa Học</h2>
              <p className="text-xs text-slate-500">Các đề tài NCKH các cấp (Nhà nước, Bộ, Tỉnh/Thành phố, Đại học, Cơ sở)</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">
            {profile.research_projects?.length || 0} đề tài
          </span>
        </div>

        {/* Input Form */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            {editingId ? 'Chỉnh sửa đề tài NCKH' : 'Thêm đề tài NCKH mới'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="sm:col-span-4">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Tên đề tài nghiên cứu <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="VD: Nghiên cứu ứng dụng Deep Learning trong nhận dạng tổn thương phổi..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Cấp quản lý</label>
              <select
                name="project_level"
                value={form.project_level}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
              >
                <option value="Nhà nước">Cấp Nhà nước</option>
                <option value="Bộ">Cấp Bộ / Ngành</option>
                <option value="Tỉnh/Thành phố">Cấp Tỉnh / TP</option>
                <option value="Trường">Cấp Trường</option>
                <option value="Cơ sở">Cấp Cơ sở / Khoa</option>
                <option value="Doanh nghiệp">Hợp tác Doanh nghiệp</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Trách nhiệm tham gia</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
              >
                <option value="Chủ nhiệm">Chủ nhiệm đề tài</option>
                <option value="Đồng chủ nhiệm">Đồng chủ nhiệm</option>
                <option value="Thư ký khoa học">Thư ký khoa học</option>
                <option value="Thành viên chính">Thành viên chính</option>
                <option value="Thành viên">Thành viên tham gia</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Năm bắt đầu</label>
              <input
                type="text"
                name="start_year"
                value={form.start_year}
                onChange={handleChange}
                placeholder="VD: 2021"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Năm hoàn thành</label>
              <input
                type="text"
                name="end_year"
                value={form.end_year}
                onChange={handleChange}
                placeholder="VD: 2023"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Trạng thái</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
              >
                <option value="Đã nghiệm thu">Đã nghiệm thu</option>
                <option value="Đang thực hiện">Đang thực hiện</option>
                <option value="Đã phê duyệt">Đã phê duyệt</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Xếp loại nghiệm thu</label>
              <input
                type="text"
                name="rating"
                value={form.rating}
                onChange={handleChange}
                placeholder="VD: Xuất sắc / Đạt"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Kinh phí (VNĐ)</label>
              <input
                type="number"
                name="funding"
                value={form.funding}
                onChange={handleChange}
                placeholder="VD: 850000000"
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
                  setForm({ name: '', project_level: 'Trường', start_year: '', end_year: '', role: 'Chủ nhiệm', status: 'Đã nghiệm thu', rating: 'Xuất sắc', funding: '' });
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
              {editingId ? 'Cập nhật đề tài' : 'Thêm đề tài'}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50/50">
                <th className="py-2.5 px-3">TT</th>
                <th className="py-2.5 px-3">Tên đề tài nghiên cứu</th>
                <th className="py-2.5 px-3">Thời gian</th>
                <th className="py-2.5 px-3">Cấp đề tài</th>
                <th className="py-2.5 px-3">Trách nhiệm</th>
                <th className="py-2.5 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {(profile.research_projects || []).map((p, idx) => {
                const tg = (p.start_year || '') + (p.end_year ? '/' + p.end_year : '');
                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{p.name}</td>
                    <td className="py-3 px-3 font-medium text-slate-600 whitespace-nowrap">{tg || '—'}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                        {p.project_level || 'Trường'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700">{p.role || 'Thành viên'}</td>
                    <td className="py-3 px-3 text-right space-x-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEdit(p)}
                        className="p-1 text-slate-400 hover:text-blue-600 transition"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(p.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {(!profile.research_projects || profile.research_projects.length === 0) && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-xs text-slate-400 italic">
                    Chưa có đề tài nghiên cứu khoa học nào được ghi nhận
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

